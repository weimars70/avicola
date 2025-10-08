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
exports.IngresosController = void 0;
const common_1 = require("@nestjs/common");
const ingresos_service_1 = require("./ingresos.service");
const create_ingreso_dto_1 = require("./dto/create-ingreso.dto");
const update_ingreso_dto_1 = require("./dto/update-ingreso.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let IngresosController = class IngresosController {
    constructor(ingresosService) {
        this.ingresosService = ingresosService;
    }
    create(createIngresoDto) {
        return this.ingresosService.create(createIngresoDto);
    }
    findAll(id_empresa) {
        return this.ingresosService.findAll(id_empresa);
    }
    findAllIncludingInactive(id_empresa) {
        return this.ingresosService.findAllIncludingInactive(id_empresa);
    }
    findByDateRange(fechaInicio, fechaFin, id_empresa) {
        return this.ingresosService.findByDateRange(fechaInicio, fechaFin, id_empresa);
    }
    findByTipo(tipo, id_empresa) {
        return this.ingresosService.findByTipo(tipo, id_empresa);
    }
    getTotalIngresos(id_empresa) {
        return this.ingresosService.getTotalIngresos(id_empresa);
    }
    getTotalIngresosByDateRange(fechaInicio, fechaFin, id_empresa) {
        return this.ingresosService.getTotalIngresosByDateRange(fechaInicio, fechaFin, id_empresa);
    }
    getTotalIngresosByTipo(id_empresa) {
        return this.ingresosService.getTotalIngresosByTipo(id_empresa);
    }
    syncIngresosFromSalidas(id_empresa) {
        return this.ingresosService.syncIngresosFromSalidas(id_empresa);
    }
    findOne(id) {
        return this.ingresosService.findOne(id);
    }
    update(id, updateIngresoDto) {
        return this.ingresosService.update(id, updateIngresoDto);
    }
    remove(id) {
        return this.ingresosService.remove(id);
    }
};
exports.IngresosController = IngresosController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ingreso_dto_1.CreateIngresoDto]),
    __metadata("design:returntype", void 0)
], IngresosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('id_empresa', new common_1.ParseIntPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], IngresosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('all-including-inactive'),
    __param(0, (0, common_1.Query)('id_empresa', new common_1.ParseIntPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], IngresosController.prototype, "findAllIncludingInactive", null);
__decorate([
    (0, common_1.Get)('by-date-range'),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __param(2, (0, common_1.Query)('id_empresa', new common_1.ParseIntPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", void 0)
], IngresosController.prototype, "findByDateRange", null);
__decorate([
    (0, common_1.Get)('by-tipo/:tipo'),
    __param(0, (0, common_1.Param)('tipo')),
    __param(1, (0, common_1.Query)('id_empresa', new common_1.ParseIntPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], IngresosController.prototype, "findByTipo", null);
__decorate([
    (0, common_1.Get)('total'),
    __param(0, (0, common_1.Query)('id_empresa', new common_1.ParseIntPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], IngresosController.prototype, "getTotalIngresos", null);
__decorate([
    (0, common_1.Get)('total-by-date-range'),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __param(2, (0, common_1.Query)('id_empresa', new common_1.ParseIntPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", void 0)
], IngresosController.prototype, "getTotalIngresosByDateRange", null);
__decorate([
    (0, common_1.Get)('total-by-tipo'),
    __param(0, (0, common_1.Query)('id_empresa', new common_1.ParseIntPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], IngresosController.prototype, "getTotalIngresosByTipo", null);
__decorate([
    (0, common_1.Post)('sync-from-salidas'),
    __param(0, (0, common_1.Query)('id_empresa', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], IngresosController.prototype, "syncIngresosFromSalidas", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IngresosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ingreso_dto_1.UpdateIngresoDto]),
    __metadata("design:returntype", void 0)
], IngresosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IngresosController.prototype, "remove", null);
exports.IngresosController = IngresosController = __decorate([
    (0, common_1.Controller)('ingresos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [ingresos_service_1.IngresosService])
], IngresosController);
//# sourceMappingURL=ingresos.controller.js.map