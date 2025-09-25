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
exports.CategoriasGastosController = void 0;
const common_1 = require("@nestjs/common");
const categorias_gastos_service_1 = require("./categorias-gastos.service");
const create_categoria_gasto_dto_1 = require("./dto/create-categoria-gasto.dto");
const update_categoria_gasto_dto_1 = require("./dto/update-categoria-gasto.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let CategoriasGastosController = class CategoriasGastosController {
    constructor(categoriasGastosService) {
        this.categoriasGastosService = categoriasGastosService;
    }
    create(createCategoriaGastoDto) {
        return this.categoriasGastosService.create(createCategoriaGastoDto);
    }
    findAll() {
        return this.categoriasGastosService.findAll();
    }
    findAllIncludingInactive() {
        return this.categoriasGastosService.findAllIncludingInactive();
    }
    findOne(id) {
        return this.categoriasGastosService.findOne(id);
    }
    update(id, updateCategoriaGastoDto) {
        return this.categoriasGastosService.update(id, updateCategoriaGastoDto);
    }
    remove(id) {
        return this.categoriasGastosService.remove(id);
    }
    seedCategorias() {
        return this.categoriasGastosService.seedCategorias();
    }
};
exports.CategoriasGastosController = CategoriasGastosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_categoria_gasto_dto_1.CreateCategoriaGastoDto]),
    __metadata("design:returntype", void 0)
], CategoriasGastosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriasGastosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('all-including-inactive'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriasGastosController.prototype, "findAllIncludingInactive", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriasGastosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_categoria_gasto_dto_1.UpdateCategoriaGastoDto]),
    __metadata("design:returntype", void 0)
], CategoriasGastosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriasGastosController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('seed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriasGastosController.prototype, "seedCategorias", null);
exports.CategoriasGastosController = CategoriasGastosController = __decorate([
    (0, common_1.Controller)('categorias-gastos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [categorias_gastos_service_1.CategoriasGastosService])
], CategoriasGastosController);
//# sourceMappingURL=categorias-gastos.controller.js.map