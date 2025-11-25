import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Compra } from './entities/compra.entity';
import { DetalleCompra } from './entities/detalle-compra.entity';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { GastosService } from '../finanzas/gastos.service';
import { CategoriasGastosService } from '../finanzas/categorias-gastos.service';
import { CreateGastoDto } from '../finanzas/dto/create-gasto.dto';

@Injectable()
export class ComprasTercerosService {
    constructor(
        @InjectRepository(Compra)
        private comprasRepository: Repository<Compra>,
        @InjectRepository(DetalleCompra)
        private detallesRepository: Repository<DetalleCompra>,
        private gastosService: GastosService,
        private categoriasService: CategoriasGastosService,
    ) { }

    async create(createCompraDto: CreateCompraDto, idEmpresa: number, idUsuario: string) {
        // Calcular total sumando los subtotales de cada detalle
        const total = createCompraDto.detalles.reduce(
            (sum, detalle) => sum + (detalle.cantidad * detalle.precioUnitario),
            0
        );

        // Crear la compra con tipo_movimiento = 2 (terceros)
        const compra = this.comprasRepository.create({
            ...createCompraDto,
            total,
            tipoMovimiento: 2, // Siempre 2 para terceros
        });
        // Asignar explícitamente campos de control para evitar omisiones del ORM
        compra.idEmpresa = idEmpresa;
        compra.idUsuarioInserta = idUsuario;

        // Guardar la compra (los detalles se guardan en cascada)
        const savedCompra = await this.comprasRepository.save(compra);

        // Crear los detalles asociados
        const detalles = createCompraDto.detalles.map(detalle =>
            this.detallesRepository.create({
                ...detalle,
                idCompra: savedCompra.id,
                tipoMovimiento: 2, // Terceros
            })
        );

        await this.detallesRepository.save(detalles);

        // Retornar la compra con sus detalles
        const compraCompleta = await this.findOne(savedCompra.id, idEmpresa);

        // Registrar el gasto en finanzas (no se gestiona estado en BD)
        await this.createGastoDesdeCompra(compraCompleta, idEmpresa, idUsuario);

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
        }

        // Actualizar la compra
        Object.assign(compra, updateCompraDto);
        await this.comprasRepository.save(compra);

        const compraActualizada = await this.findOne(id, idEmpresa);
        await this.syncGastoDesdeCompra(compraActualizada, idEmpresa, compraActualizada.idUsuarioInserta || '');
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
    }
}
