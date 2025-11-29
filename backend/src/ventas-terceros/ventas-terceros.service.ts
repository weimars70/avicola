import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { IngresosService } from '../finanzas/ingresos.service';
import { CreateIngresoDto } from '../finanzas/dto/create-ingreso.dto';
import { InventarioTerceros } from '../inventario-terceros/entities/inventario-terceros.entity';
import { Canasta } from '../canastas/entities/canasta.entity';
import { Salida } from '../salidas/entities/salida.entity';
import { Inventario } from '../inventario/entities/inventario.entity';

@Injectable()
export class VentasTercerosService {
    constructor(
        @InjectRepository(Venta)
        private ventasRepository: Repository<Venta>,
        @InjectRepository(DetalleVenta)
        private detallesRepository: Repository<DetalleVenta>,
        @InjectRepository(InventarioTerceros)
        private invTercerosRepo: Repository<InventarioTerceros>,
        @InjectRepository(Canasta)
        private canastasRepo: Repository<Canasta>,
        @InjectRepository(Salida)
        private salidasRepo: Repository<Salida>,
        @InjectRepository(Inventario)
        private inventarioRepo: Repository<Inventario>,
        private ingresosService: IngresosService,
    ) { }

    async create(createVentaDto: CreateVentaDto, idEmpresa: number, idUsuario: string) {
        // Validar que hay detalles
        if (!createVentaDto.detalles || createVentaDto.detalles.length === 0) {
            throw new BadRequestException('Debe incluir al menos un detalle en la venta');
        }

        // Validar que idTercero existe
        if (!createVentaDto.idTercero || createVentaDto.idTercero <= 0) {
            throw new BadRequestException('Debe especificar un cliente (tercero) válido');
        }

        const total = createVentaDto.detalles.reduce(
            (sum, detalle) => sum + (detalle.cantidad * detalle.precioUnitario),
            0
        );

        const { detalles: detallesDto, ...ventaData } = createVentaDto as any;

        const detallesValidados = (detallesDto || []).map((detalle: any) => ({
            ...detalle,
            inventarioOrigen: detalle.inventarioOrigen ?? 2,
        }));

        // Validar que todas las canastas existen antes de la transacción
        for (const d of detallesValidados) {
            const canastaCodigo = d.canastaId || '';
            if (!canastaCodigo || canastaCodigo.trim() === '') {
                throw new BadRequestException('Cada detalle debe tener una canasta asignada');
            }

            // Verificar que la canasta existe
            const canastaExiste = await this.canastasRepo.findOne({ where: { id: canastaCodigo } });
            if (!canastaExiste) {
                throw new BadRequestException(`La canasta con ID ${canastaCodigo} no existe`);
            }
        }

        // Ejecutar toda la operación en una transacción atómica
        const savedVenta = await this.ventasRepository.manager.transaction(async (manager) => {
            const ventasRepo = manager.getRepository(Venta);
            const detallesRepo = manager.getRepository(DetalleVenta);
            const invRepo = manager.getRepository(InventarioTerceros);

            // Validar stock DENTRO de la transacción para evitar condiciones de carrera
            for (const d of detallesValidados) {
                if ((d.inventarioOrigen ?? 2) === 2) {
                    const canastaCodigo = d.canastaId || '';
                    const cantidadCanastas = Number(d.cantidad);

                    if (cantidadCanastas <= 0) {
                        throw new BadRequestException(`La cantidad debe ser mayor a 0`);
                    }

                    // Calcular stock consolidado directamente sin método intermedio
                    const stockRaw = await invRepo.createQueryBuilder('i')
                        .select("COALESCE(SUM(CASE WHEN i.tipo_movimiento = 'entrada' THEN i.cantidad WHEN i.tipo_movimiento = 'salida' THEN -i.cantidad ELSE 0 END),0)", 'stock')
                        .where('i.id_empresa = :idEmpresa AND i.tipo_huevo_codigo = :tipoHuevoCodigo AND i.activo = true', {
                            idEmpresa,
                            tipoHuevoCodigo: canastaCodigo,
                        })
                        .getRawOne();

                    const stockActual = Number(stockRaw?.stock || 0);

                    if (stockActual < cantidadCanastas) {
                        const canasta = await this.canastasRepo.findOne({ where: { id: canastaCodigo }, relations: ['tipoHuevo'] });
                        const canastaNombre = canasta?.nombre || 'Canasta';
                        throw new BadRequestException(
                            `Stock insuficiente de ${canastaNombre}. Disponible: ${stockActual} canasta(s), solicitado: ${cantidadCanastas} canasta(s)`
                        );
                    }
                }
            }

            // Crear la venta
            const venta = ventasRepo.create({
                ...ventaData,
                total,
                idEmpresa,
                idUsuarioInserta: idUsuario,
                tipoMovimiento: 2,
            }) as unknown as Venta;

            const v = await ventasRepo.save(venta);

            // Crear los detalles
            const detalles = detallesValidados.map((d: any) =>
                detallesRepo.create({
                    ...d,
                    idVenta: v.id,
                    inventarioOrigen: d.inventarioOrigen ?? 2,
                })
            );

            await detallesRepo.save(detalles);

            const salidasRepo = manager.getRepository(Salida);
            const inventarioRepo = manager.getRepository(Inventario);

            // Crear movimientos de inventario (descontar stock según origen)
            for (const d of detalles) {
                const origen = d.inventarioOrigen ?? 2;
                const canastaCodigo = d.canastaId || '';
                const cantidadCanastas = Number(d.cantidad);
                const precioCanasta = Number(d.precioUnitario);

                if (origen === 2) {
                    // INVENTARIO DE TERCEROS
                    // Recalcular stock antes de cada salida
                    const stockRaw = await invRepo.createQueryBuilder('i')
                        .select("COALESCE(SUM(CASE WHEN i.tipo_movimiento = 'entrada' THEN i.cantidad WHEN i.tipo_movimiento = 'salida' THEN -i.cantidad ELSE 0 END),0)", 'stock')
                        .where('i.id_empresa = :idEmpresa AND i.tipo_huevo_codigo = :tipoHuevoCodigo AND i.activo = true', {
                            idEmpresa,
                            tipoHuevoCodigo: canastaCodigo,
                        })
                        .getRawOne();

                    const stockAnterior = Number(stockRaw?.stock || 0);
                    const stockNuevo = stockAnterior - cantidadCanastas;

                    const movimiento = invRepo.create({
                        idEmpresa,
                        idTercero: v.idTercero,
                        tipoHuevoCodigo: canastaCodigo,
                        cantidad: cantidadCanastas,
                        tipoMovimiento: 'salida',
                        precioUnitario: precioCanasta,
                        valorTotal: cantidadCanastas * precioCanasta,
                        concepto: 'Venta terceros',
                        descripcion: `Factura ${v.numeroFactura || v.id}`.trim(),
                        stockAnterior,
                        stockActual: stockNuevo,
                        activo: true,
                    });
                    await invRepo.save(movimiento);
                } else if (origen === 1) {
                    // INVENTARIO PROPIO - crear salida normal
                    const canasta = await this.canastasRepo.findOne({ where: { id: canastaCodigo }, relations: ['tipoHuevo'] });
                    if (!canasta) {
                        throw new BadRequestException(`La canasta con ID ${canastaCodigo} no existe`);
                    }

                    const tipoHuevoId = canasta.tipoHuevo?.id;
                    if (!tipoHuevoId) {
                        throw new BadRequestException(`La canasta ${canasta.nombre} no tiene tipo de huevo asociado`);
                    }

                    const unidadesTotal = cantidadCanastas * canasta.unidadesPorCanasta;

                    // Crear salida normal
                    const salida = salidasRepo.create({
                        tipoHuevoId,
                        canastaId: canastaCodigo,
                        nombreComprador: `Venta Tercero: ${v.numeroFactura || v.id}`,
                        unidades: unidadesTotal,
                        valor: cantidadCanastas * precioCanasta,
                        fecha: v.fecha,
                        activo: true,
                        id_empresa: idEmpresa,
                        id_usuario_inserta: idUsuario,
                    });
                    await salidasRepo.save(salida);

                    // Actualizar inventario propio
                    const inv = await inventarioRepo.findOne({
                        where: { tipoHuevoId, id_empresa: idEmpresa }
                    });
                    if (inv) {
                        inv.unidades = Math.max(0, inv.unidades - unidadesTotal);
                        inv.id_usuario_actualiza = idUsuario;
                        await inventarioRepo.save(inv);
                    }
                }
            }

            return v;
        });

        // Crear el ingreso financiero de forma asíncrona (no bloqueante)
        // Usar setImmediate para no bloquear la respuesta
        setImmediate(async () => {
            try {
                const ventaCompleta = await this.findOne(savedVenta.id, idEmpresa);
                await this.createIngresoDesdeVenta(ventaCompleta, idEmpresa, idUsuario);
            } catch (error) {
                console.error('Error al crear ingreso desde venta:', error);
            }
        });

        // Retornar la venta básica inmediatamente para evitar timeout
        return await this.ventasRepository.findOne({
            where: { id: savedVenta.id, idEmpresa },
            relations: ['tercero', 'detalles', 'detalles.canasta']
        });
    }

    async findAll(idEmpresa: number) {
        return await this.ventasRepository.find({
            where: {
                idEmpresa,
                tipoMovimiento: 2, // Solo ventas de terceros
                activo: true,
            },
            relations: ['tercero', 'detalles', 'detalles.canasta'],
            order: {
                fecha: 'DESC',
                createdAt: 'DESC' // Orden por fecha de creación también
            },
        });
    }

    async findOne(id: string, idEmpresa: number) {
        const venta = await this.ventasRepository.findOne({
            where: { id, idEmpresa, activo: true },
            relations: ['tercero', 'detalles', 'detalles.canasta'],
        });

        if (!venta) {
            throw new NotFoundException(`Venta con ID ${id} no encontrada`);
        }

        return venta;
    }

    async update(id: string, updateVentaDto: UpdateVentaDto, idEmpresa: number) {
        const venta = await this.findOne(id, idEmpresa);

        if (updateVentaDto.detalles) {
            const total = updateVentaDto.detalles.reduce(
                (sum, detalle) => sum + (detalle.cantidad * detalle.precioUnitario),
                0
            );
            updateVentaDto['total'] = total;

            const nuevosDetalles = updateVentaDto.detalles.map(detalle => ({
                ...detalle,
                inventarioOrigen: detalle.inventarioOrigen ?? 2,
            }));

            // Validar que todas las canastas existen antes de la transacción
            for (const d of nuevosDetalles) {
                const canastaCodigo = d.canastaId || '';
                if (!canastaCodigo || canastaCodigo.trim() === '') {
                    throw new BadRequestException('Cada detalle debe tener una canasta asignada');
                }

                // Verificar que la canasta existe
                const canastaExiste = await this.canastasRepo.findOne({ where: { id: canastaCodigo } });
                if (!canastaExiste) {
                    throw new BadRequestException(`La canasta con ID ${canastaCodigo} no existe`);
                }
            }

            await this.ventasRepository.manager.transaction(async (manager) => {
                const detallesRepo = manager.getRepository(DetalleVenta);
                const ventasRepo = manager.getRepository(Venta);
                const invRepo = manager.getRepository(InventarioTerceros);

                // Eliminar detalles anteriores
                await detallesRepo.delete({ idVenta: id });

                // Marcar movimientos anteriores como inactivos
                await invRepo.createQueryBuilder()
                    .update()
                    .set({ activo: false })
                    .where('id_empresa = :idEmpresa AND concepto = :concepto AND descripcion LIKE :desc', {
                        idEmpresa,
                        concepto: 'Venta terceros',
                        desc: `%${venta.numeroFactura || venta.id}%`
                    })
                    .execute();

                // Validar stock DENTRO de la transacción
                for (const d of nuevosDetalles) {
                    if ((d.inventarioOrigen ?? 2) === 2) {
                        const canastaCodigo = d.canastaId || '';
                        const cantidadCanastas = Number(d.cantidad);

                        if (cantidadCanastas <= 0) {
                            throw new BadRequestException(`La cantidad debe ser mayor a 0`);
                        }

                        const stockActual = await this.getStockActualTercerosWithRepo(invRepo, idEmpresa, venta.idTercero, canastaCodigo);

                        if (stockActual < cantidadCanastas) {
                            const canasta = await this.canastasRepo.findOne({ where: { id: canastaCodigo }, relations: ['tipoHuevo'] });
                            const canastaNombre = canasta?.nombre || 'Canasta';
                            throw new BadRequestException(
                                `Stock insuficiente de ${canastaNombre}. Disponible: ${stockActual} canasta(s), solicitado: ${cantidadCanastas} canasta(s)`
                            );
                        }
                    }
                }

                // Crear nuevos detalles
                const detalles = nuevosDetalles.map(detalle =>
                    detallesRepo.create({
                        ...detalle,
                        idVenta: id,
                        inventarioOrigen: detalle.inventarioOrigen ?? 2,
                    })
                );

                await detallesRepo.save(detalles);

                // Crear nuevos movimientos de inventario
                for (const d of detalles) {
                    if ((d.inventarioOrigen ?? 2) === 2) {
                        const canastaCodigo = d.canastaId || '';
                        const cantidadCanastas = Number(d.cantidad);
                        const precioCanasta = Number(d.precioUnitario);

                        const stockAnterior = await this.getStockActualTercerosWithRepo(invRepo, idEmpresa, venta.idTercero, canastaCodigo);

                        const movimiento = invRepo.create({
                            idEmpresa,
                            idTercero: venta.idTercero,
                            tipoHuevoCodigo: canastaCodigo,
                            cantidad: cantidadCanastas,
                            tipoMovimiento: 'salida',
                            precioUnitario: precioCanasta,
                            valorTotal: cantidadCanastas * precioCanasta,
                            concepto: 'Venta terceros',
                            descripcion: `Factura ${venta.numeroFactura || venta.id}`.trim(),
                            stockAnterior,
                            stockActual: stockAnterior - cantidadCanastas,
                            activo: true,
                        });
                        await invRepo.save(movimiento);
                    }
                }

                // Actualizar la venta
                const { detalles: _omitDetalles, ...updateSinDetalles } = updateVentaDto as any;
                Object.assign(venta, updateSinDetalles);
                await ventasRepo.save(venta);
            });
        } else {
            // Solo actualizar campos básicos de la venta (sin tocar detalles)
            const { detalles: _omitDetalles, ...updateSinDetalles } = updateVentaDto as any;
            Object.assign(venta, updateSinDetalles);
            await this.ventasRepository.save(venta);
        }

        const ventaActualizada = await this.findOne(id, idEmpresa);

        try {
            await this.syncIngresoDesdeVenta(ventaActualizada, idEmpresa, ventaActualizada.idUsuarioInserta || '');
        } catch (error) {
            console.error('Error al sincronizar ingreso desde venta:', error);
            // No fallar la actualización si falla la sincronización del ingreso
        }

        return ventaActualizada;
    }

    async remove(id: string, idEmpresa: number) {
        const venta = await this.findOne(id, idEmpresa);

        // Soft delete
        venta.activo = false;
        await this.ventasRepository.save(venta);

        // Marcar ingreso relacionado como inactivo
        try {
            const ingresos = await this.ingresosService.findAllIncludingInactive(idEmpresa);
            const ingresoRelacionado = ingresos.find(i => (i.referencia || '') === venta.id);
            if (ingresoRelacionado) {
                await this.ingresosService.remove(ingresoRelacionado.id);
            }
        } catch {}
        // Marcar movimientos de inventario terceros como inactivos
        try {
            await this.invTercerosRepo.createQueryBuilder()
                .update()
                .set({ activo: false })
                .where('id_empresa = :idEmpresa AND concepto = :concepto AND descripcion LIKE :desc', {
                    idEmpresa,
                    concepto: 'Venta terceros',
                    desc: `%${venta.numeroFactura || ''}%`
                })
                .execute();
        } catch {}
        return { message: 'Venta eliminada correctamente' };
    }

    // Método adicional para obtener estadísticas
    async getEstadisticas(idEmpresa: number) {
        const ventas = await this.findAll(idEmpresa);

        const totalVentas = ventas.length;
        const totalIngresado = ventas.reduce((sum, v) => sum + Number(v.total), 0);
        const ventasPendientes = ventas.filter(v => v.estado === 'PENDIENTE').length;
        const totalPendiente = ventas
            .filter(v => v.estado === 'PENDIENTE')
            .reduce((sum, v) => sum + Number(v.total), 0);
        const ventasPagadas = ventas.filter(v => v.estado === 'PAGADO').length;
        const totalPagado = ventas
            .filter(v => v.estado === 'PAGADO')
            .reduce((sum, v) => sum + Number(v.total), 0);

        return {
            totalVentas,
            totalIngresado,
            ventasPendientes,
            totalPendiente,
            ventasPagadas,
            totalPagado,
            promedioVenta: totalVentas > 0 ? totalIngresado / totalVentas : 0,
        };
    }

    private async createIngresoDesdeVenta(venta: Venta, idEmpresa: number, idUsuario: string): Promise<void> {
        try {
            const ingresoDto: CreateIngresoDto = {
                monto: Number(venta.total),
                fecha: venta.fecha,
                descripcion: `Venta terceros ${venta.tercero?.nombre || ''} [origen=terceros]`.trim(),
                observaciones: venta.observaciones || '',
                referencia: venta.id,
                tipo: 'venta',
                id_empresa: idEmpresa,
                id_usuario_inserta: idUsuario,
            };

            // Evitar duplicado por referencia
            const existentes = await this.ingresosService.findAllIncludingInactive(idEmpresa);
            const yaExiste = existentes.some(i => (i.referencia || '') === venta.id);
            if (!yaExiste) {
                await this.ingresosService.create(ingresoDto);
            }
        } catch (e) {
        }
    }

    private async syncIngresoDesdeVenta(venta: Venta, idEmpresa: number, idUsuario: string): Promise<void> {
        try {
            const ingresos = await this.ingresosService.findAllIncludingInactive(idEmpresa);
            const ingresoRelacionado = ingresos.find(i => (i.referencia || '') === venta.id);
            if (ingresoRelacionado) {
                await this.ingresosService.update(ingresoRelacionado.id, {
                    descripcion: `Venta terceros ${venta.tercero?.nombre || ''} [origen=terceros]`.trim(),
                    monto: Number(venta.total),
                    fecha: venta.fecha,
                    observaciones: ingresoRelacionado.observaciones || '',
                    tipo: ingresoRelacionado.tipo || 'venta',
                } as any);
            } else {
                await this.createIngresoDesdeVenta(venta, idEmpresa, idUsuario);
            }
        } catch {}
    }

    private async getStockActualTerceros(idEmpresa: number, idTercero: number, tipoHuevoCodigo: string): Promise<number> {
        if (!tipoHuevoCodigo) return 0;
        // Stock consolidado: suma de TODOS los terceros (no solo del tercero específico)
        // porque las compras pueden venir de diferentes proveedores
        const raw = await this.invTercerosRepo.createQueryBuilder('i')
            .select("COALESCE(SUM(CASE WHEN i.tipo_movimiento = 'entrada' THEN i.cantidad WHEN i.tipo_movimiento = 'salida' THEN -i.cantidad ELSE 0 END),0)", 'stock')
            .where('i.id_empresa = :idEmpresa AND i.tipo_huevo_codigo = :tipoHuevoCodigo AND i.activo = true', {
                idEmpresa,
                tipoHuevoCodigo,
            })
            .andWhere("EXISTS (SELECT 1 FROM canastas c WHERE c.id::text = i.tipo_huevo_codigo)")
            .getRawOne();
        return Number(raw?.stock || 0);
    }

    private async getStockActualTercerosWithRepo(repo: Repository<InventarioTerceros>, idEmpresa: number, idTercero: number, tipoHuevoCodigo: string): Promise<number> {
        if (!tipoHuevoCodigo) return 0;
        // Stock consolidado: suma de TODOS los terceros (no solo del tercero específico)
        // porque las compras pueden venir de diferentes proveedores
        const raw = await repo.createQueryBuilder('i')
            .select("COALESCE(SUM(CASE WHEN i.tipo_movimiento = 'entrada' THEN i.cantidad WHEN i.tipo_movimiento = 'salida' THEN -i.cantidad ELSE 0 END),0)", 'stock')
            .where('i.id_empresa = :idEmpresa AND i.tipo_huevo_codigo = :tipoHuevoCodigo AND i.activo = true', {
                idEmpresa,
                tipoHuevoCodigo,
            })
            .andWhere("EXISTS (SELECT 1 FROM canastas c WHERE c.id::text = i.tipo_huevo_codigo)")
            .getRawOne();
        return Number(raw?.stock || 0);
    }
}
