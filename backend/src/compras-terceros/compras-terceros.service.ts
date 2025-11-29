import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Compra } from './entities/compra.entity';
import { DetalleCompra } from './entities/detalle-compra.entity';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { GastosService } from '../finanzas/gastos.service';
import { CategoriasGastosService } from '../finanzas/categorias-gastos.service';
import { CreateGastoDto } from '../finanzas/dto/create-gasto.dto';
import { InventarioTerceros } from '../inventario-terceros/entities/inventario-terceros.entity';
import { Canasta } from '../canastas/entities/canasta.entity';
import { Tercero } from '../terceros/entities/tercero.entity';

@Injectable()
export class ComprasTercerosService {
    constructor(
        @InjectRepository(Compra)
        private comprasRepository: Repository<Compra>,
        @InjectRepository(DetalleCompra)
        private detallesRepository: Repository<DetalleCompra>,
        @InjectRepository(InventarioTerceros)
        private invTercerosRepo: Repository<InventarioTerceros>,
        @InjectRepository(Canasta)
        private canastasRepo: Repository<Canasta>,
        @InjectRepository(Tercero)
        private tercerosRepo: Repository<Tercero>,
        private gastosService: GastosService,
        private categoriasService: CategoriasGastosService,
    ) { }

    async create(createCompraDto: CreateCompraDto, idEmpresa: number, idUsuario: string) {
        const terceroCodigo = Number(createCompraDto.idTercero);
        if (!terceroCodigo || terceroCodigo <= 0) {
            throw new BadRequestException('Tercero inválido: seleccione un proveedor válido');
        }
        const tercero = await this.tercerosRepo.findOne({ where: { codigo: terceroCodigo, idEmpresa } });
        if (!tercero) {
            throw new BadRequestException('El tercero no existe en esta empresa');
        }

        const detallesArray = createCompraDto.detalles || [];
        const total = detallesArray.reduce(
            (sum, detalle) => sum + (detalle.cantidad * detalle.precioUnitario),
            0
        );

        // Crear la compra con tipo_movimiento = 2 (terceros)
        const { detalles: detallesDto, ...compraData } = createCompraDto as any;
        const compra = this.comprasRepository.create({
            ...compraData,
            total,
            tipoMovimiento: 2, // Siempre 2 para terceros
        }) as unknown as Compra;
        // Asignar explícitamente campos de control para evitar omisiones del ORM
        compra.idEmpresa = idEmpresa;
        compra.idUsuarioInserta = idUsuario;
        compra.idTercero = terceroCodigo;

        // Guardar la compra (los detalles se guardan en cascada)
        const savedCompra = await this.comprasRepository.save(compra);

        // Crear los detalles asociados
        const detalles = (detallesDto || []).map((detalle: any) =>
            this.detallesRepository.create({
                ...detalle,
                idCompra: savedCompra.id,
                tipoMovimiento: 2, // Terceros
            })
        );

        await this.detallesRepository.save(detalles);

        // Registrar movimientos en inventario de terceros (entradas) por canastas
        for (const d of detalles) {
            const canastaCodigo = d.canastaId || 'sin_canasta';
            const cantidadCanastas = Math.round(Number(d.cantidad));
            const precioCanasta = Number(d.precioUnitario);

            // Calcular stock consolidado directamente
            const stockRaw = await this.invTercerosRepo.createQueryBuilder('i')
                .select("COALESCE(SUM(CASE WHEN i.tipo_movimiento = 'entrada' THEN i.cantidad WHEN i.tipo_movimiento = 'salida' THEN -i.cantidad ELSE 0 END),0)", 'stock')
                .where('i.id_empresa = :idEmpresa AND i.tipo_huevo_codigo = :tipoHuevoCodigo AND i.activo = true', {
                    idEmpresa,
                    tipoHuevoCodigo: canastaCodigo,
                })
                .getRawOne();

            const stockAnterior = Number(stockRaw?.stock || 0);
            const stockNuevo = stockAnterior + cantidadCanastas;

            const movimiento = this.invTercerosRepo.create({
                idEmpresa,
                idTercero: compra.idTercero,
                tipoHuevoCodigo: canastaCodigo,
                cantidad: cantidadCanastas,
                tipoMovimiento: 'entrada',
                precioUnitario: precioCanasta,
                valorTotal: cantidadCanastas * precioCanasta,
                concepto: 'Compra terceros',
                descripcion: `Factura ${compra.numeroFactura || ''}`.trim(),
                stockAnterior,
                stockActual: stockNuevo,
                activo: true,
            });
            await this.invTercerosRepo.save(movimiento);
        }

        // Retornar la compra con sus detalles
        const compraCompleta = await this.findOne(savedCompra.id, idEmpresa);

        // Registrar el gasto en finanzas si el DTO indica pagado
        if ((createCompraDto.estado || 'PENDIENTE') === 'PAGADO') {
            await this.createGastoDesdeCompra(compraCompleta, idEmpresa, idUsuario);
        }

        return compraCompleta;
    }

    async findAll(idEmpresa: number) {
        return await this.comprasRepository.find({
            where: { idEmpresa, tipoMovimiento: 2, activo: true },
            relations: ['tercero', 'detalles'],
            order: { fecha: 'DESC' },
        });
    }

    async findOne(id: string, idEmpresa: number) {
        const compra = await this.comprasRepository.findOne({
            where: { id, idEmpresa, activo: true },
            relations: ['tercero', 'detalles'],
        });

        if (!compra) {
            throw new NotFoundException(`Compra con ID ${id} no encontrada`);
        }

        return compra;
    }

    async update(id: string, updateCompraDto: UpdateCompraDto, idEmpresa: number) {
        const compra = await this.comprasRepository.findOne({ where: { id, idEmpresa, activo: true }, relations: ['tercero'] });
        
        if (!compra) {
            throw new NotFoundException(`Compra con ID ${id} no encontrada`);
        }

        // Si se actualizan los detalles, recalcular el total
        if (updateCompraDto.detalles && updateCompraDto.detalles.length > 0) {
            const total = updateCompraDto.detalles.reduce(
                (sum, detalle) => sum + (detalle.cantidad * detalle.precioUnitario),
                0
            );
            updateCompraDto['total'] = total;

            // Eliminar detalles anteriores
            await this.detallesRepository.delete({ idCompra: id });

            // Crear nuevos detalles
            const nuevosDetalles = updateCompraDto.detalles.map(detalle =>
                this.detallesRepository.create({
                    ...detalle,
                    idCompra: id,
                    tipoMovimiento: 2,
                })
            );

            await this.detallesRepository.save(nuevosDetalles);
            try {
                await this.invTercerosRepo.createQueryBuilder()
                    .update()
                    .set({ activo: false })
                    .where('id_empresa = :idEmpresa AND concepto = :concepto AND descripcion LIKE :desc', {
                        idEmpresa,
                        concepto: 'Compra terceros',
                        desc: `%${compra.numeroFactura || ''}%`
                    })
                    .execute();
                for (const d of nuevosDetalles) {
                    const canastaCodigo = d.canastaId || 'sin_canasta';
                    const cantidadCanastas = Math.round(Number(d.cantidad));
                    const precioCanasta = Number(d.precioUnitario);
                    const stockAnterior = await this.getStockActualTerceros(idEmpresa, compra.idTercero, canastaCodigo);
                    const movimiento = this.invTercerosRepo.create({
                        idEmpresa,
                        idTercero: compra.idTercero,
                        tipoHuevoCodigo: canastaCodigo,
                        cantidad: cantidadCanastas,
                        tipoMovimiento: 'entrada',
                        precioUnitario: precioCanasta,
                        valorTotal: cantidadCanastas * precioCanasta,
                        concepto: 'Compra terceros',
                        descripcion: `Factura ${compra.numeroFactura || ''}`.trim(),
                        stockAnterior,
                        stockActual: stockAnterior + cantidadCanastas,
                        activo: true,
                    });
                    await this.invTercerosRepo.save(movimiento);
                }
            } catch {}
        }

        // Actualizar la compra
        const { detalles: _omitDetalles, ...updateSinDetalles } = updateCompraDto as any;
        Object.assign(compra, updateSinDetalles);
        await this.comprasRepository.save(compra);

        const compraActualizada = await this.findOne(id, idEmpresa);
        // Procesar estado recibido en DTO (gestiona finanzas sin columna en BD)
        if (updateCompraDto.estado === 'PAGADO') {
            await this.createGastoDesdeCompra(compraActualizada, idEmpresa, compraActualizada.idUsuarioInserta || '');
        } else if (updateCompraDto.estado === 'PENDIENTE') {
            try {
                const gastos = await this.gastosService.findAll(idEmpresa);
                const gastoRelacionado = gastos.find(g => (g.numeroFactura || '') === (compraActualizada.numeroFactura || '') && (g.proveedor || '') === (compraActualizada.tercero?.nombre || ''));
                if (gastoRelacionado) {
                    await this.gastosService.remove(gastoRelacionado.id);
                }
            } catch {}
        } else {
            await this.syncGastoDesdeCompra(compraActualizada, idEmpresa, compraActualizada.idUsuarioInserta || '');
        }
        return compraActualizada;
    }

    async remove(id: string, idEmpresa: number) {
        const compra = await this.findOne(id, idEmpresa);

        // Soft delete
        compra.activo = false;
        await this.comprasRepository.save(compra);

        // Marcar gasto relacionado como inactivo
        try {
            const gastos = await this.gastosService.findAll(idEmpresa);
            const gastoRelacionado = gastos.find(g => (g.numeroFactura || '') === (compra.numeroFactura || '') && (g.proveedor || '') === (compra.tercero?.nombre || ''));
            if (gastoRelacionado) {
                await this.gastosService.remove(gastoRelacionado.id);
            }
        } catch {}

        // Marcar movimientos de inventario terceros como inactivos
        try {
            await this.invTercerosRepo.createQueryBuilder()
                .update()
                .set({ activo: false })
                .where('id_empresa = :idEmpresa AND concepto = :concepto AND descripcion LIKE :desc', {
                    idEmpresa,
                    concepto: 'Compra terceros',
                    desc: `%${compra.numeroFactura || ''}%`
                })
                .execute();
        } catch {}

        return { message: 'Compra eliminada correctamente' };
    }

    // Método adicional para obtener estadísticas
    async getEstadisticas(idEmpresa: number) {
        const compras = await this.findAll(idEmpresa);

        const totalCompras = compras.length;
        const totalGastado = compras.reduce((sum, c) => sum + Number(c.total), 0);
        const comprasPendientes = 0;
        const totalPendiente = 0;

        return {
            totalCompras,
            totalGastado,
            comprasPendientes,
            totalPendiente,
            promedioCompra: totalCompras > 0 ? totalGastado / totalCompras : 0,
        };
    }

    private async ensureCategoriaComprasTerceros(): Promise<number> {
        const categorias = await this.categoriasService.findAll();
        const existente = categorias.find(c => c.nombre === 'Compras de Terceros');
        if (existente) return existente.id;
        const creada = await this.categoriasService.create({ nombre: 'Compras de Terceros', descripcion: 'Compras realizadas a terceros', color: '#764ba2' });
        return creada.id;
    }

    private async createGastoDesdeCompra(compra: Compra, idEmpresa: number, idUsuario: string): Promise<void> {
        try {
            const categoriaId = await this.ensureCategoriaComprasTerceros();
            const gastoDto: CreateGastoDto = {
                descripcion: `Compra terceros ${compra.tercero?.nombre || ''}`.trim(),
                monto: Number(compra.total),
                fecha: compra.fecha,
                observaciones: `[origen=terceros]`,
                numeroFactura: compra.numeroFactura || undefined,
                proveedor: compra.tercero?.nombre || undefined,
                categoriaId,
                id_empresa: idEmpresa,
                id_usuario_inserta: idUsuario,
                activo: true,
            };

            // Evitar duplicado por factura en la misma empresa
            const existentes = await this.gastosService.findAll(idEmpresa);
            const yaExiste = existentes.some(g => (g.numeroFactura || '') === (compra.numeroFactura || '') && Number(g.monto) === Number(compra.total) && g.fecha.toISOString().startsWith(compra.fecha));
            if (!yaExiste) {
                await this.gastosService.create(gastoDto);
            }
        } catch (e) {
        }
    }

    private async syncGastoDesdeCompra(compra: Compra, idEmpresa: number, idUsuario: string): Promise<void> {
        try {
            const gastos = await this.gastosService.findAll(idEmpresa);
            const gastoRelacionado = gastos.find(g => (g.numeroFactura || '') === (compra.numeroFactura || '') && (g.proveedor || '') === (compra.tercero?.nombre || ''));
            if (gastoRelacionado) {
                await this.gastosService.update(gastoRelacionado.id, {
                    descripcion: `Compra terceros ${compra.tercero?.nombre || ''}`.trim(),
                    monto: Number(compra.total),
                    fecha: compra.fecha,
                    observaciones: `[origen=terceros]`,
                    categoriaId: gastoRelacionado.categoriaId,
                } as any);
            } else {
                await this.createGastoDesdeCompra(compra, idEmpresa, idUsuario);
            }
        } catch {}
        // No ajustar inventario aquí; los movimientos quedan registrados por compra
    }

    private async getStockActualTerceros(idEmpresa: number, idTercero: number, tipoHuevoCodigo: string): Promise<number> {
        if (!tipoHuevoCodigo) return 0;
        // Stock consolidado: suma de TODOS los terceros (no solo del tercero específico)
        // porque las compras pueden venir de diferentes proveedores y se usa inventario compartido
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
}
