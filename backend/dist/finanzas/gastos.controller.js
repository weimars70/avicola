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
exports.GastosController = void 0;
const common_1 = require("@nestjs/common");
const gastos_service_1 = require("./gastos.service");
const create_gasto_dto_1 = require("./dto/create-gasto.dto");
const update_gasto_dto_1 = require("./dto/update-gasto.dto");
const create_consumo_propio_dto_1 = require("./dto/create-consumo-propio.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let GastosController = class GastosController {
    constructor(gastosService) {
        this.gastosService = gastosService;
    }
    create(createGastoDto) {
        return this.gastosService.create(createGastoDto);
    }
    createConsumoPropio(createConsumoPropioDto) {
        return this.gastosService.createConsumoPropio(createConsumoPropioDto);
    }
    findAll(id_empresa) {
        return this.gastosService.findAll(id_empresa);
    }
    findAllIncludingInactive() {
        return this.gastosService.findAllIncludingInactive();
    }
    findByDateRange(fechaInicio, fechaFin) {
        return this.gastosService.findByDateRange(fechaInicio, fechaFin);
    }
    findByCategoria(categoriaId) {
        return this.gastosService.findByCategoria(parseInt(categoriaId));
    }
    getTotalGastos(id_empresa) {
        return this.gastosService.getTotalGastos(id_empresa);
    }
    getTotalGastosByDateRange(fechaInicio, fechaFin, id_empresa) {
        return this.gastosService.getTotalGastosByDateRange(fechaInicio, fechaFin, id_empresa);
    }
    getTotalGastosByCategoria(id_empresa) {
        return this.gastosService.getTotalGastosByCategoria(id_empresa);
    }
    findOne(id) {
        return this.gastosService.findOne(id);
    }
    update(id, updateGastoDto) {
        console.log('=== CONTROLADOR GASTOS: PATCH ===');
        console.log('ID recibido:', id);
        console.log('DTO recibido:', JSON.stringify(updateGastoDto));
        console.log('Tipo de datos:', {
            descripcion: typeof updateGastoDto.descripcion,
            monto: typeof updateGastoDto.monto,
            fecha: typeof updateGastoDto.fecha,
            observaciones: typeof updateGastoDto.observaciones,
            categoriaId: typeof updateGastoDto.categoriaId
        });
        try {
            const result = this.gastosService.update(id, updateGastoDto);
            console.log('=== CONTROLADOR GASTOS: ÉXITO ===');
            return result;
        }
        catch (error) {
            console.error('=== CONTROLADOR GASTOS: ERROR ===');
            console.error('Error:', error.message);
            console.error('Stack:', error.stack);
            throw error;
        }
    }
    remove(id) {
        return this.gastosService.remove(id);
    }
};
exports.GastosController = GastosController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_gasto_dto_1.CreateGastoDto]),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('consumo-propio'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_consumo_propio_dto_1.CreateConsumoPropioDto]),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "createConsumoPropio", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('id_empresa', new common_1.ParseIntPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('all-including-inactive'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "findAllIncludingInactive", null);
__decorate([
    (0, common_1.Get)('by-date-range'),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "findByDateRange", null);
__decorate([
    (0, common_1.Get)('by-categoria/:categoriaId'),
    __param(0, (0, common_1.Param)('categoriaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "findByCategoria", null);
__decorate([
    (0, common_1.Get)('total'),
    __param(0, (0, common_1.Query)('id_empresa', new common_1.ParseIntPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "getTotalGastos", null);
__decorate([
    (0, common_1.Get)('total-by-date-range'),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __param(2, (0, common_1.Query)('id_empresa', new common_1.ParseIntPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "getTotalGastosByDateRange", null);
__decorate([
    (0, common_1.Get)('total-by-categoria'),
    __param(0, (0, common_1.Query)('id_empresa', new common_1.ParseIntPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "getTotalGastosByCategoria", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_gasto_dto_1.UpdateGastoDto]),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "remove", null);
exports.GastosController = GastosController = __decorate([
    (0, common_1.Controller)('gastos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [gastos_service_1.GastosService])
], GastosController);
//# sourceMappingURL=gastos.controller.js.map