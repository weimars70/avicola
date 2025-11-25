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
exports.SalidasController = void 0;
const common_1 = require("@nestjs/common");
const salidas_service_1 = require("./salidas.service");
const create_salida_dto_1 = require("./dto/create-salida.dto");
const update_salida_dto_1 = require("./dto/update-salida.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const empresa_decorator_1 = require("../terceros/decorators/empresa.decorator");
let SalidasController = class SalidasController {
    constructor(salidasService) {
        this.salidasService = salidasService;
    }
    create(createSalidaDto, id_empresa) {
        createSalidaDto.id_empresa = id_empresa;
        return this.salidasService.create(createSalidaDto, id_empresa);
    }
    findAll(id_empresa) {
        return this.salidasService.findAll(id_empresa);
    }
    findOne(id, id_empresa) {
        return this.salidasService.findOne(id, id_empresa);
    }
    update(id, updateSalidaDto, id_empresa) {
        return this.salidasService.update(id, updateSalidaDto, id_empresa);
    }
    remove(id, id_empresa) {
        return this.salidasService.remove(id, id_empresa);
    }
};
exports.SalidasController = SalidasController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_salida_dto_1.CreateSalidaDto, Number]),
    __metadata("design:returntype", void 0)
], SalidasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], SalidasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], SalidasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_salida_dto_1.UpdateSalidaDto, Number]),
    __metadata("design:returntype", void 0)
], SalidasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], SalidasController.prototype, "remove", null);
exports.SalidasController = SalidasController = __decorate([
    (0, common_1.Controller)('salidas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [salidas_service_1.SalidasService])
], SalidasController);
//# sourceMappingURL=salidas.controller.js.map