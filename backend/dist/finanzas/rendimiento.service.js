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
exports.RendimientoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rendimiento_entity_1 = require("./entities/rendimiento.entity");
const gastos_service_1 = require("./gastos.service");
const ingresos_service_1 = require("./ingresos.service");
let RendimientoService = class RendimientoService {
    constructor(rendimientoRepository, gastosService, ingresosService) {
        this.rendimientoRepository = rendimientoRepository;
        this.gastosService = gastosService;
        this.ingresosService = ingresosService;
    }
    async create(createRendimientoDto) {
        const rendimiento = this.rendimientoRepository.create(createRendimientoDto);
        return await this.rendimientoRepository.save(rendimiento);
    }
    async findAll() {
        return await this.rendimientoRepository.find({
            where: { activo: true },
            order: { fecha: 'DESC' },
        });
    }
    async findOne(id) {
        const rendimiento = await this.rendimientoRepository.findOne({
            where: { id, activo: true },
        });
        if (!rendimiento) {
            throw new common_1.NotFoundException(`Rendimiento con ID ${id} no encontrado`);
        }
        return rendimiento;
    }
    async update(id, updateRendimientoDto) {
        const rendimiento = await this.findOne(id);
        Object.assign(rendimiento, updateRendimientoDto);
        return await this.rendimientoRepository.save(rendimiento);
    }
    async remove(id) {
        const rendimiento = await this.findOne(id);
        rendimiento.activo = false;
        await this.rendimientoRepository.save(rendimiento);
    }
    async findByDateRange(fechaInicio, fechaFin) {
        return await this.rendimientoRepository.find({
            where: {
                fecha: (0, typeorm_2.Between)(new Date(fechaInicio), new Date(fechaFin)),
                activo: true,
            },
            order: { fecha: 'DESC' },
        });
    }
    async findByPeriodo(periodo) {
        return await this.rendimientoRepository.find({
            where: { periodo, activo: true },
            order: { fecha: 'DESC' },
        });
    }
    async calcularRendimientoDiario(fecha, id_empresa = 1) {
        const fechaInicio = fecha;
        const fechaFin = fecha;
        const totalIngresos = await this.ingresosService.getTotalIngresosByDateRange(fechaInicio, fechaFin, id_empresa);
        const totalGastos = await this.gastosService.getTotalGastosByDateRange(fechaInicio, fechaFin, id_empresa);
        const utilidadNeta = totalIngresos - totalGastos;
        const margenUtilidad = totalIngresos > 0 ? (utilidadNeta / totalIngresos) * 100 : 0;
        const roi = totalGastos > 0 ? (utilidadNeta / totalGastos) * 100 : 0;
        const rendimientoData = {
            fecha,
            totalIngresos,
            totalGastos,
            utilidadNeta,
            margenUtilidad: parseFloat(margenUtilidad.toFixed(2)),
            roi: parseFloat(roi.toFixed(2)),
            periodo: 'diario',
            observaciones: `Rendimiento calculado automáticamente para ${fecha}`,
        };
        return await this.create(rendimientoData);
    }
    async calcularRendimientoMensual(año, mes, id_empresa = 1) {
        const fechaInicio = new Date(año, mes - 1, 1).toISOString().split('T')[0];
        const fechaFin = new Date(año, mes, 0).toISOString().split('T')[0];
        const totalIngresos = await this.ingresosService.getTotalIngresosByDateRange(fechaInicio, fechaFin, id_empresa);
        const totalGastos = await this.gastosService.getTotalGastosByDateRange(fechaInicio, fechaFin, id_empresa);
        const utilidadNeta = totalIngresos - totalGastos;
        const margenUtilidad = totalIngresos > 0 ? (utilidadNeta / totalIngresos) * 100 : 0;
        const roi = totalGastos > 0 ? (utilidadNeta / totalGastos) * 100 : 0;
        const rendimientoData = {
            fecha: fechaFin,
            totalIngresos,
            totalGastos,
            utilidadNeta,
            margenUtilidad: parseFloat(margenUtilidad.toFixed(2)),
            roi: parseFloat(roi.toFixed(2)),
            periodo: 'mensual',
            observaciones: `Rendimiento mensual para ${mes}/${año}`,
        };
        return await this.create(rendimientoData);
    }
    async getMetricasRendimiento() {
        const rendimientos = await this.findAll();
        if (rendimientos.length === 0) {
            return {
                promedioMargenUtilidad: 0,
                promedioROI: 0,
                mejorMes: null,
                peorMes: null,
                tendencia: 'sin_datos',
            };
        }
        const promedioMargenUtilidad = rendimientos.reduce((sum, r) => sum + r.margenUtilidad, 0) / rendimientos.length;
        const promedioROI = rendimientos.reduce((sum, r) => sum + r.roi, 0) / rendimientos.length;
        const mejorMes = rendimientos.reduce((mejor, actual) => actual.utilidadNeta > mejor.utilidadNeta ? actual : mejor);
        const peorMes = rendimientos.reduce((peor, actual) => actual.utilidadNeta < peor.utilidadNeta ? actual : peor);
        const ultimos3 = rendimientos.slice(0, 3);
        let tendencia = 'estable';
        if (ultimos3.length >= 2) {
            const diferencia = ultimos3[0].utilidadNeta - ultimos3[ultimos3.length - 1].utilidadNeta;
            if (diferencia > 0)
                tendencia = 'creciente';
            else if (diferencia < 0)
                tendencia = 'decreciente';
        }
        return {
            promedioMargenUtilidad: parseFloat(promedioMargenUtilidad.toFixed(2)),
            promedioROI: parseFloat(promedioROI.toFixed(2)),
            mejorMes: {
                fecha: mejorMes.fecha,
                utilidadNeta: mejorMes.utilidadNeta,
                margenUtilidad: mejorMes.margenUtilidad,
            },
            peorMes: {
                fecha: peorMes.fecha,
                utilidadNeta: peorMes.utilidadNeta,
                margenUtilidad: peorMes.margenUtilidad,
            },
            tendencia,
            totalRendimientos: rendimientos.length,
        };
    }
};
exports.RendimientoService = RendimientoService;
exports.RendimientoService = RendimientoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rendimiento_entity_1.Rendimiento)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        gastos_service_1.GastosService,
        ingresos_service_1.IngresosService])
], RendimientoService);
//# sourceMappingURL=rendimiento.service.js.map