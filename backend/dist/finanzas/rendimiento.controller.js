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
exports.RendimientoController = void 0;
const common_1 = require("@nestjs/common");
const rendimiento_service_1 = require("./rendimiento.service");
const create_rendimiento_dto_1 = require("./dto/create-rendimiento.dto");
const update_rendimiento_dto_1 = require("./dto/update-rendimiento.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let RendimientoController = class RendimientoController {
    constructor(rendimientoService) {
        this.rendimientoService = rendimientoService;
    }
    create(createRendimientoDto) {
        return this.rendimientoService.create(createRendimientoDto);
    }
    findAll() {
        return this.rendimientoService.findAll();
    }
    getMetricasRendimiento() {
        return this.rendimientoService.getMetricasRendimiento();
    }
    findByDateRange(fechaInicio, fechaFin) {
        return this.rendimientoService.findByDateRange(fechaInicio, fechaFin);
    }
    findByPeriodo(periodo) {
        return this.rendimientoService.findByPeriodo(periodo);
    }
    calcularRendimientoDiario(fecha, id_empresa) {
        return this.rendimientoService.calcularRendimientoDiario(fecha, id_empresa);
    }
    calcularRendimientoMensual(año, mes, id_empresa) {
        return this.rendimientoService.calcularRendimientoMensual(año, mes, id_empresa);
    }
    findOne(id) {
        return this.rendimientoService.findOne(id);
    }
    update(id, updateRendimientoDto) {
        return this.rendimientoService.update(id, updateRendimientoDto);
    }
    remove(id) {
        return this.rendimientoService.remove(id);
    }
};
exports.RendimientoController = RendimientoController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_rendimiento_dto_1.CreateRendimientoDto]),
    __metadata("design:returntype", void 0)
], RendimientoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RendimientoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('metricas'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RendimientoController.prototype, "getMetricasRendimiento", null);
__decorate([
    (0, common_1.Get)('by-date-range'),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RendimientoController.prototype, "findByDateRange", null);
__decorate([
    (0, common_1.Get)('by-periodo/:periodo'),
    __param(0, (0, common_1.Param)('periodo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RendimientoController.prototype, "findByPeriodo", null);
__decorate([
    (0, common_1.Post)('calcular-diario'),
    __param(0, (0, common_1.Body)('fecha')),
    __param(1, (0, common_1.Query)('id_empresa', new common_1.ParseIntPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], RendimientoController.prototype, "calcularRendimientoDiario", null);
__decorate([
    (0, common_1.Post)('calcular-mensual'),
    __param(0, (0, common_1.Body)('año', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('mes', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('id_empresa', new common_1.ParseIntPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", void 0)
], RendimientoController.prototype, "calcularRendimientoMensual", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RendimientoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_rendimiento_dto_1.UpdateRendimientoDto]),
    __metadata("design:returntype", void 0)
], RendimientoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RendimientoController.prototype, "remove", null);
exports.RendimientoController = RendimientoController = __decorate([
    (0, common_1.Controller)('rendimiento'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [rendimiento_service_1.RendimientoService])
], RendimientoController);
//# sourceMappingURL=rendimiento.controller.js.map