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
exports.ResumenController = void 0;
const common_1 = require("@nestjs/common");
const resumen_service_1 = require("./resumen.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let ResumenController = class ResumenController {
    constructor(resumenService) {
        this.resumenService = resumenService;
    }
    getResumen(galponId, tipoHuevoId, id_empresa) {
        if (!id_empresa) {
            throw new Error('No hay empresa asociada al usuario logueado');
        }
        const id_empresa_num = parseInt(id_empresa);
        return this.resumenService.getInventarioResumen(galponId, tipoHuevoId, id_empresa_num);
    }
};
exports.ResumenController = ResumenController;
__decorate([
    (0, common_1.Get)('resumen'),
    __param(0, (0, common_1.Query)('galponId')),
    __param(1, (0, common_1.Query)('tipoHuevoId')),
    __param(2, (0, common_1.Query)('id_empresa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ResumenController.prototype, "getResumen", null);
exports.ResumenController = ResumenController = __decorate([
    (0, common_1.Controller)('inventario'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [resumen_service_1.ResumenService])
], ResumenController);
//# sourceMappingURL=resumen.controller.js.map