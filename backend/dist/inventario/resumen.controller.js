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
const empresa_decorator_1 = require("../terceros/decorators/empresa.decorator");
let ResumenController = class ResumenController {
    constructor(resumenService) {
        this.resumenService = resumenService;
    }
    getResumen(id_empresa_num, galponId, tipoHuevoId) {
        return this.resumenService.getInventarioResumen(galponId, tipoHuevoId, id_empresa_num);
    }
    getResumenTerceros(id_empresa_num, terceroId) {
        const id_tercero_num = terceroId ? parseInt(terceroId) : undefined;
        return this.resumenService.getInventarioTercerosResumen(id_empresa_num, id_tercero_num);
    }
};
exports.ResumenController = ResumenController;
__decorate([
    (0, common_1.Get)('resumen'),
    __param(0, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __param(1, (0, common_1.Query)('galponId')),
    __param(2, (0, common_1.Query)('tipoHuevoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", void 0)
], ResumenController.prototype, "getResumen", null);
__decorate([
    (0, common_1.Get)('terceros-resumen'),
    __param(0, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __param(1, (0, common_1.Query)('terceroId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], ResumenController.prototype, "getResumenTerceros", null);
exports.ResumenController = ResumenController = __decorate([
    (0, common_1.Controller)('inventario'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [resumen_service_1.ResumenService])
], ResumenController);
//# sourceMappingURL=resumen.controller.js.map