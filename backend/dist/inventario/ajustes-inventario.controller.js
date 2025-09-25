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
exports.AjustesInventarioController = void 0;
const common_1 = require("@nestjs/common");
const ajustes_inventario_service_1 = require("./ajustes-inventario.service");
const create_ajuste_inventario_dto_1 = require("./dto/create-ajuste-inventario.dto");
const create_ajuste_lote_dto_1 = require("./dto/create-ajuste-lote.dto");
const update_ajuste_lote_dto_1 = require("./dto/update-ajuste-lote.dto");
let AjustesInventarioController = class AjustesInventarioController {
    constructor(ajustesInventarioService) {
        this.ajustesInventarioService = ajustesInventarioService;
    }
    create(createAjusteDto) {
        return this.ajustesInventarioService.create(createAjusteDto);
    }
    findAll() {
        return this.ajustesInventarioService.findAll();
    }
    findByTipoHuevo(tipoHuevoId) {
        return this.ajustesInventarioService.findByTipoHuevo(tipoHuevoId);
    }
    findOne(id) {
        return this.ajustesInventarioService.findOne(id);
    }
    createLote(createAjusteLoteDto) {
        return this.ajustesInventarioService.createLote(createAjusteLoteDto);
    }
    findAllLotes() {
        return this.ajustesInventarioService.findAllLotes();
    }
    findOneLote(id) {
        return this.ajustesInventarioService.findOneLote(id);
    }
    updateLote(id, updateAjusteLoteDto) {
        return this.ajustesInventarioService.updateLote(id, updateAjusteLoteDto);
    }
    removeLote(id) {
        return this.ajustesInventarioService.removeLote(id);
    }
    update(id, updateAjusteDto) {
        return this.ajustesInventarioService.update(id, updateAjusteDto);
    }
    remove(id) {
        return this.ajustesInventarioService.remove(id);
    }
};
exports.AjustesInventarioController = AjustesInventarioController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ajuste_inventario_dto_1.CreateAjusteInventarioDto]),
    __metadata("design:returntype", void 0)
], AjustesInventarioController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AjustesInventarioController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('tipo-huevo/:tipoHuevoId'),
    __param(0, (0, common_1.Param)('tipoHuevoId', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AjustesInventarioController.prototype, "findByTipoHuevo", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AjustesInventarioController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('lotes'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ajuste_lote_dto_1.CreateAjusteLoteDto]),
    __metadata("design:returntype", void 0)
], AjustesInventarioController.prototype, "createLote", null);
__decorate([
    (0, common_1.Get)('lotes/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AjustesInventarioController.prototype, "findAllLotes", null);
__decorate([
    (0, common_1.Get)('lotes/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AjustesInventarioController.prototype, "findOneLote", null);
__decorate([
    (0, common_1.Put)('lotes/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ajuste_lote_dto_1.UpdateAjusteLoteDto]),
    __metadata("design:returntype", void 0)
], AjustesInventarioController.prototype, "updateLote", null);
__decorate([
    (0, common_1.Delete)('lotes/:id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AjustesInventarioController.prototype, "removeLote", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_ajuste_inventario_dto_1.CreateAjusteInventarioDto]),
    __metadata("design:returntype", void 0)
], AjustesInventarioController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AjustesInventarioController.prototype, "remove", null);
exports.AjustesInventarioController = AjustesInventarioController = __decorate([
    (0, common_1.Controller)('ajustes-inventario'),
    __metadata("design:paramtypes", [ajustes_inventario_service_1.AjustesInventarioService])
], AjustesInventarioController);
//# sourceMappingURL=ajustes-inventario.controller.js.map