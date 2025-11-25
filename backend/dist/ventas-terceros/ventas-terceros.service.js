"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentasTercerosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const venta_entity_1 = require("./entities/venta.entity");
const detalle_venta_entity_1 = require("./entities/detalle-venta.entity");
const ingresos_service_1 = require("../finanzas/ingresos.service");
let VentasTercerosService = class VentasTercerosService {
    constructor(ventasRepository, detallesRepository, ingresosService) {
        this.ventasRepository = ventasRepository;
        this.detallesRepository = detallesRepository;
        this.ingresosService = ingresosService;
    }
    async create(createVentaDto, idEmpresa, idUsuario) {
        const total = createVentaDto.detalles.reduce((sum, detalle) => sum + (detalle.cantidad * detalle.precioUnitario), 0);
        const venta = this.ventasRepository.create(Object.assign(Object.assign({}, createVentaDto), { total,
            idEmpresa, idUsuarioInserta: idUsuario, tipoMovimiento: 2 }));
        const savedVenta = await this.ventasRepository.save(venta);
        const detalles = createVentaDto.detalles.map(detalle => this.detallesRepository.create(Object.assign(Object.assign({}, detalle), { idVenta: savedVenta.id, inventarioOrigen: detalle.inventarioOrigen || 1 })));
        await this.detallesRepository.save(detalles);
        const ventaCompleta = await this.findOne(savedVenta.id, idEmpresa);
        await this.createIngresoDesdeVenta(ventaCompleta, idEmpresa, idUsuario);
        return ventaCompleta;
    }
    async findAll(idEmpresa) {
        return await this.ventasRepository.find({
            where: {
                idEmpresa,
                tipoMovimiento: 2,
                activo: true,
            },
            relations: ['tercero', 'detalles', 'detalles.canasta'],
            order: { fecha: 'DESC' },
        });
    }
    async findOne(id, idEmpresa) {
        const venta = await this.ventasRepository.findOne({
            where: { id, idEmpresa, activo: true },
            relations: ['tercero', 'detalles', 'detalles.canasta'],
        });
        if (!venta) {
            throw new common_1.NotFoundException(`Venta con ID ${id} no encontrada`);
        }
        return venta;
    }
    async update(id, updateVentaDto, idEmpresa) {
        const venta = await this.findOne(id, idEmpresa);
        if (updateVentaDto.detalles) {
            const total = updateVentaDto.detalles.reduce((sum, detalle) => sum + (detalle.cantidad * detalle.precioUnitario), 0);
            updateVentaDto['total'] = total;
            await this.detallesRepository.delete({ idVenta: id });
            const nuevosDetalles = updateVentaDto.detalles.map(detalle => this.detallesRepository.create(Object.assign(Object.assign({}, detalle), { idVenta: id, inventarioOrigen: detalle.inventarioOrigen || 1 })));
            await this.detallesRepository.save(nuevosDetalles);
        }
        Object.assign(venta, updateVentaDto);
        await this.ventasRepository.save(venta);
        const ventaActualizada = await this.findOne(id, idEmpresa);
        await this.syncIngresoDesdeVenta(ventaActualizada, idEmpresa, ventaActualizada.idUsuarioInserta || '');
        return ventaActualizada;
    }
    async remove(id, idEmpresa) {
        const venta = await this.findOne(id, idEmpresa);
        venta.activo = false;
        await this.ventasRepository.save(venta);
        try {
            const ingresos = await this.ingresosService.findAllIncludingInactive(idEmpresa);
            const ingresoRelacionado = ingresos.find(i => (i.referencia || '') === venta.id);
            if (ingresoRelacionado) {
                await this.ingresosService.remove(ingresoRelacionado.id);
            }
        }
        catch (_a) { }
        return { message: 'Venta eliminada correctamente' };
    }
    async getEstadisticas(idEmpresa) {
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
    async createIngresoDesdeVenta(venta, idEmpresa, idUsuario) {
        var _a;
        try {
            const ingresoDto = {
                monto: Number(venta.total),
                fecha: venta.fecha,
                descripcion: `Venta terceros ${((_a = venta.tercero) === null || _a === void 0 ? void 0 : _a.nombre) || ''} [origen=terceros]`.trim(),
                observaciones: venta.observaciones || '',
                referencia: venta.id,
                tipo: 'venta',
                id_empresa: idEmpresa,
                id_usuario_inserta: idUsuario,
            };
            const existentes = await this.ingresosService.findAllIncludingInactive(idEmpresa);
            const yaExiste = existentes.some(i => (i.referencia || '') === venta.id);
            if (!yaExiste) {
                await this.ingresosService.create(ingresoDto);
            }
        }
        catch (e) {
        }
    }
    async syncIngresoDesdeVenta(venta, idEmpresa, idUsuario) {
        var _a;
        try {
            const ingresos = await this.ingresosService.findAllIncludingInactive(idEmpresa);
            const ingresoRelacionado = ingresos.find(i => (i.referencia || '') === venta.id);
            if (ingresoRelacionado) {
                await this.ingresosService.update(ingresoRelacionado.id, {
                    descripcion: `Venta terceros ${((_a = venta.tercero) === null || _a === void 0 ? void 0 : _a.nombre) || ''} [origen=terceros]`.trim(),
                    monto: Number(venta.total),
                    fecha: venta.fecha,
                    observaciones: ingresoRelacionado.observaciones || '',
                    tipo: ingresoRelacionado.tipo || 'venta',
                });
            }
            else {
                await this.createIngresoDesdeVenta(venta, idEmpresa, idUsuario);
            }
        }
        catch (_b) { }
    }
};
exports.VentasTercerosService = VentasTercerosService;
exports.VentasTercerosService = VentasTercerosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(venta_entity_1.Venta)),
    __param(1, (0, typeorm_1.InjectRepository)(detalle_venta_entity_1.DetalleVenta)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        ingresos_service_1.IngresosService])
], VentasTercerosService);
//# sourceMappingURL=ventas-terceros.service.js.map