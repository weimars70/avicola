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
exports.IngresosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ingreso_entity_1 = require("./entities/ingreso.entity");
const salidas_service_1 = require("../salidas/salidas.service");
let IngresosService = class IngresosService {
    constructor(ingresosRepository, salidasService) {
        this.ingresosRepository = ingresosRepository;
        this.salidasService = salidasService;
    }
    async create(createIngresoDto) {
        const ingreso = this.ingresosRepository.create(createIngresoDto);
        return await this.ingresosRepository.save(ingreso);
    }
    async findAll() {
        return await this.ingresosRepository.find({
            where: { activo: true },
            relations: ['salida'],
            order: { fecha: 'DESC' },
        });
    }
    async findAllIncludingInactive() {
        return await this.ingresosRepository.find({
            relations: ['salida'],
            order: { fecha: 'DESC' },
        });
    }
    async findOne(id) {
        const ingreso = await this.ingresosRepository.findOne({
            where: { id, activo: true },
            relations: ['salida'],
        });
        if (!ingreso) {
            throw new common_1.NotFoundException(`Ingreso con ID ${id} no encontrado`);
        }
        return ingreso;
    }
    async findByDateRange(fechaInicio, fechaFin) {
        return await this.ingresosRepository.find({
            where: {
                fecha: (0, typeorm_2.Between)(fechaInicio, fechaFin),
                activo: true,
            },
            relations: ['salida'],
            order: { fecha: 'DESC' },
        });
    }
    async findByTipo(tipo) {
        return await this.ingresosRepository.find({
            where: { tipo, activo: true },
            relations: ['salida'],
            order: { fecha: 'DESC' },
        });
    }
    async update(id, updateIngresoDto) {
        const ingreso = await this.findOne(id);
        Object.assign(ingreso, updateIngresoDto);
        return await this.ingresosRepository.save(ingreso);
    }
    async remove(id) {
        const ingreso = await this.findOne(id);
        ingreso.activo = false;
        await this.ingresosRepository.save(ingreso);
    }
    async getTotalIngresos() {
        const result = await this.ingresosRepository
            .createQueryBuilder('ingreso')
            .select('SUM(ingreso.monto)', 'total')
            .where('ingreso.activo = :activo', { activo: true })
            .getRawOne();
        return parseFloat(result.total) || 0;
    }
    async getTotalIngresosByDateRange(fechaInicio, fechaFin) {
        const result = await this.ingresosRepository
            .createQueryBuilder('ingreso')
            .select('SUM(ingreso.monto)', 'total')
            .where('ingreso.activo = :activo', { activo: true })
            .andWhere('ingreso.fecha BETWEEN :fechaInicio AND :fechaFin', {
            fechaInicio,
            fechaFin,
        })
            .getRawOne();
        return parseFloat(result.total) || 0;
    }
    async getTotalIngresosByTipo() {
        const result = await this.ingresosRepository
            .createQueryBuilder('ingreso')
            .select('ingreso.tipo', 'tipo')
            .addSelect('SUM(ingreso.monto)', 'total')
            .addSelect('COUNT(ingreso.id)', 'cantidad')
            .where('ingreso.activo = :activo', { activo: true })
            .groupBy('ingreso.tipo')
            .getRawMany();
        return result.map(item => ({
            tipo: item.tipo,
            total: parseFloat(item.total) || 0,
            cantidad: parseInt(item.cantidad) || 0,
        }));
    }
    async syncIngresosFromSalidas() {
        var _a, _b;
        const salidas = await this.salidasService.findAll();
        const ingresosCreados = [];
        for (const salida of salidas) {
            const ingresoExistente = await this.ingresosRepository.findOne({
                where: { salidaId: salida.id },
            });
            if (!ingresoExistente) {
                const monto = salida.unidades * (((_a = salida.canasta) === null || _a === void 0 ? void 0 : _a.valorCanasta) || 0);
                const nuevoIngreso = await this.create({
                    monto,
                    fecha: salida.createdAt.toISOString().split('T')[0],
                    descripcion: `Venta de ${salida.unidades} unidades de ${((_b = salida.tipoHuevo) === null || _b === void 0 ? void 0 : _b.nombre) || 'huevos'}`,
                    observaciones: `Generado automáticamente desde salida ${salida.id}`,
                    tipo: 'venta',
                    salidaId: salida.id,
                });
                ingresosCreados.push(nuevoIngreso);
            }
        }
        return ingresosCreados;
    }
    async getIngresosDiarios(fechaInicio, fechaFin) {
        const result = await this.ingresosRepository
            .createQueryBuilder('ingreso')
            .select('DATE(ingreso.fecha)', 'fecha')
            .addSelect('SUM(ingreso.monto)', 'total')
            .where('ingreso.fecha BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
            .andWhere('ingreso.activo = :activo', { activo: true })
            .groupBy('DATE(ingreso.fecha)')
            .orderBy('fecha', 'ASC')
            .getRawMany();
        return result;
    }
};
exports.IngresosService = IngresosService;
exports.IngresosService = IngresosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ingreso_entity_1.Ingreso)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => salidas_service_1.SalidasService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        salidas_service_1.SalidasService])
], IngresosService);
//# sourceMappingURL=ingresos.service.js.map