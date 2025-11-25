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
exports.InventarioStockController = void 0;
const common_1 = require("@nestjs/common");
const inventario_stock_service_1 = require("./inventario-stock.service");
const create_inventario_dto_1 = require("./dto/create-inventario.dto");
const update_inventario_dto_1 = require("./dto/update-inventario.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const empresa_decorator_1 = require("../terceros/decorators/empresa.decorator");
let InventarioStockController = class InventarioStockController {
    constructor(inventarioStockService) {
        this.inventarioStockService = inventarioStockService;
    }
    create(createInventarioDto) {
        return this.inventarioStockService.create(createInventarioDto);
    }
    findAll(id_empresa) {
        return this.inventarioStockService.findAll(id_empresa);
    }
    getVistaInventario(id_empresa) {
        return this.inventarioStockService.getVistaInventario(id_empresa);
    }
    findByTipoHuevo(tipoHuevoId, id_empresa) {
        return this.inventarioStockService.findByTipoHuevo(tipoHuevoId, id_empresa);
    }
    findOne(id) {
        return this.inventarioStockService.findOne(id);
    }
    update(id, updateInventarioDto) {
        return this.inventarioStockService.update(id, updateInventarioDto);
    }
    remove(id) {
        return this.inventarioStockService.remove(id);
    }
};
exports.InventarioStockController = InventarioStockController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventario_dto_1.CreateInventarioDto]),
    __metadata("design:returntype", void 0)
], InventarioStockController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InventarioStockController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('vista/inventario'),
    __param(0, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InventarioStockController.prototype, "getVistaInventario", null);
__decorate([
    (0, common_1.Get)('tipo-huevo/:tipoHuevoId'),
    __param(0, (0, common_1.Param)('tipoHuevoId', common_1.ParseUUIDPipe)),
    __param(1, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], InventarioStockController.prototype, "findByTipoHuevo", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InventarioStockController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_inventario_dto_1.UpdateInventarioDto]),
    __metadata("design:returntype", void 0)
], InventarioStockController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InventarioStockController.prototype, "remove", null);
exports.InventarioStockController = InventarioStockController = __decorate([
    (0, common_1.Controller)('inventario-stock'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [inventario_stock_service_1.InventarioStockService])
], InventarioStockController);
//# sourceMappingURL=inventario-stock.controller.js.map