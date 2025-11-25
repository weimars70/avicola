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
exports.EntradasProduccionController = void 0;
const common_1 = require("@nestjs/common");
const entradas_produccion_service_1 = require("./entradas-produccion.service");
const create_entrada_produccion_dto_1 = require("./dto/create-entrada-produccion.dto");
const update_entrada_produccion_dto_1 = require("./dto/update-entrada-produccion.dto");
const create_entradas_masivas_dto_1 = require("./dto/create-entradas-masivas.dto");
let EntradasProduccionController = class EntradasProduccionController {
    constructor(entradasProduccionService) {
        this.entradasProduccionService = entradasProduccionService;
    }
    create(createEntradaProduccionDto, id_empresa, id_usuario_inserta) {
        createEntradaProduccionDto.id_empresa = id_empresa;
        createEntradaProduccionDto.id_usuario_inserta = id_usuario_inserta;
        return this.entradasProduccionService.create(createEntradaProduccionDto);
    }
    createMasivas(createEntradasMasivasDto, id_empresa, id_usuario_inserta) {
        createEntradasMasivasDto.id_empresa = id_empresa;
        createEntradasMasivasDto.id_usuario_inserta = id_usuario_inserta;
        return this.entradasProduccionService.createMasivas(createEntradasMasivasDto);
    }
    findAll(id_empresa) {
        return this.entradasProduccionService.findAll(id_empresa);
    }
    findOne(id) {
        return this.entradasProduccionService.findOne(id);
    }
    update(id, updateEntradaProduccionDto) {
        return this.entradasProduccionService.update(id, updateEntradaProduccionDto);
    }
    remove(id) {
        return this.entradasProduccionService.remove(id);
    }
};
exports.EntradasProduccionController = EntradasProduccionController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('id_empresa', new common_1.ParseIntPipe({ errorHttpStatusCode: 400 }))),
    __param(2, (0, common_1.Query)('id_usuario_inserta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_entrada_produccion_dto_1.CreateEntradaProduccionDto, Number, String]),
    __metadata("design:returntype", void 0)
], EntradasProduccionController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('masivas'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('id_empresa', new common_1.ParseIntPipe({ errorHttpStatusCode: 400 }))),
    __param(2, (0, common_1.Query)('id_usuario_inserta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_entradas_masivas_dto_1.CreateEntradasMasivasDto, Number, String]),
    __metadata("design:returntype", void 0)
], EntradasProduccionController.prototype, "createMasivas", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('id_empresa', new common_1.ParseIntPipe({ errorHttpStatusCode: 400 }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EntradasProduccionController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EntradasProduccionController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_entrada_produccion_dto_1.UpdateEntradaProduccionDto]),
    __metadata("design:returntype", void 0)
], EntradasProduccionController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EntradasProduccionController.prototype, "remove", null);
exports.EntradasProduccionController = EntradasProduccionController = __decorate([
    (0, common_1.Controller)('entradas-produccion'),
    __metadata("design:paramtypes", [entradas_produccion_service_1.EntradasProduccionService])
], EntradasProduccionController);
//# sourceMappingURL=entradas-produccion.controller.js.map