import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { IngresosService } from '../finanzas/ingresos.service';
import { CreateIngresoDto } from '../finanzas/dto/create-ingreso.dto';

@Injectable()
export class VentasTercerosService {
    constructor(
        @InjectRepository(Venta)
        private ventasRepository: Repository<Venta>,
        @InjectRepository(DetalleVenta)
        private detallesRepository: Repository<DetalleVenta>,
        private ingresosService: IngresosService,
    ) { }

    async create(createVentaDto: CreateVentaDto, idEmpresa: number, idUsuario: string) {
        // Calcular total sumando los subtotales de cada detalle
        const total = createVentaDto.detalles.reduce(
            (sum, detalle) => sum + (detalle.cantidad * detalle.precioUnitario),
            0
        );

        // Crear la venta con tipo_movimiento = 2 (terceros)
        const venta = this.ventasRepository.create({
            ...createVentaDto,
            total,
            idEmpresa,
            idUsuarioInserta: idUsuario,
            tipoMovimiento: 2, // Siempre 2 para terceros
        });

        // Guardar la venta
        const savedVenta = await this.ventasRepository.save(venta);

        // Crear los detalles asociados
        const detalles = createVentaDto.detalles.map(detalle =>
            this.detallesRepository.create({
                ...detalle,
                idVenta: savedVenta.id,
                inventarioOrigen: detalle.inventarioOrigen || 1, // Default: inventario normal
            })
        );

        await this.detallesRepository.save(detalles);

        // Retornar la venta con sus detalles
        const ventaCompleta = await this.findOne(savedVenta.id, idEmpresa);

        // Registrar ingreso (terceros) sin depender de estado
        await this.createIngresoDesdeVenta(ventaCompleta, idEmpresa, idUsuario);

        return ventaCompleta;
    }

    async findAll(idEmpresa: number) {
        return await this.ventasRepository.find({
            where: {
                idEmpresa,
                tipoMovimiento: 2, // Solo ventas de terceros
                activo: true,
            },
            relations: ['tercero', 'detalles', 'detalles.canasta'],
            order: { fecha: 'DESC' },
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

        // Si se actualizan los detalles, recalcular el total
        if (updateVentaDto.detalles) {
            const total = updateVentaDto.detalles.reduce(
                (sum, detalle) => sum + (detalle.cantidad * detalle.precioUnitario),
                0
            );
            updateVentaDto['total'] = total;

            // Eliminar detalles anteriores
            await this.detallesRepository.delete({ idVenta: id });

            // Crear nuevos detalles
            const nuevosDetalles = updateVentaDto.detalles.map(detalle =>
                this.detallesRepository.create({
                    ...detalle,
                    idVenta: id,
                    inventarioOrigen: detalle.inventarioOrigen || 1,
                })
            );

            await this.detallesRepository.save(nuevosDetalles);
        }

        // Actualizar la venta
        Object.assign(venta, updateVentaDto);
        await this.ventasRepository.save(venta);

        const ventaActualizada = await this.findOne(id, idEmpresa);
        await this.syncIngresoDesdeVenta(ventaActualizada, idEmpresa, ventaActualizada.idUsuarioInserta || '');
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
}
