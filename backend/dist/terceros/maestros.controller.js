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
exports.MaestrosController = void 0;
const common_1 = require("@nestjs/common");
const maestros_service_1 = require("./maestros.service");
const empresa_decorator_1 = require("./decorators/empresa.decorator");
const empresa_guard_1 = require("./guards/empresa.guard");
const swagger_1 = require("@nestjs/swagger");
let MaestrosController = class MaestrosController {
    constructor(maestrosService) {
        this.maestrosService = maestrosService;
    }
    findAllCiudades(activo, idEmpresa) {
        return this.maestrosService.findAllCiudades(activo);
    }
    findAllEstratos(id_empresa, activo) {
        return this.maestrosService.findAllEstratos(activo, id_empresa);
    }
    findAllTiposRegimen(activo, idEmpresa) {
        return this.maestrosService.findAllTiposRegimen(activo);
    }
    findAllTiposIdent(activo, idEmpresa) {
        return this.maestrosService.findAllTiposIdent(activo);
    }
    findAllTiposImpuesto(activo, idEmpresa) {
        return this.maestrosService.findAllTiposImpuesto(activo);
    }
};
exports.MaestrosController = MaestrosController;
__decorate([
    (0, common_1.Get)('ciudades'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las ciudades' }),
    __param(0, (0, common_1.Query)('activo')),
    __param(1, (0, common_1.Query)('id_empresa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, Number]),
    __metadata("design:returntype", void 0)
], MaestrosController.prototype, "findAllCiudades", null);
__decorate([
    (0, common_1.Get)('estratos'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los estratos' }),
    __param(0, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __param(1, (0, common_1.Query)('activo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Boolean]),
    __metadata("design:returntype", void 0)
], MaestrosController.prototype, "findAllEstratos", null);
__decorate([
    (0, common_1.Get)('tipos-regimen'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los tipos de régimen' }),
    __param(0, (0, common_1.Query)('activo')),
    __param(1, (0, common_1.Query)('id_empresa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, Number]),
    __metadata("design:returntype", void 0)
], MaestrosController.prototype, "findAllTiposRegimen", null);
__decorate([
    (0, common_1.Get)('tipos-identificacion'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los tipos de identificación' }),
    __param(0, (0, common_1.Query)('activo')),
    __param(1, (0, common_1.Query)('id_empresa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, Number]),
    __metadata("design:returntype", void 0)
], MaestrosController.prototype, "findAllTiposIdent", null);
__decorate([
    (0, common_1.Get)('tipos-impuesto'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los tipos de impuesto' }),
    __param(0, (0, common_1.Query)('activo')),
    __param(1, (0, common_1.Query)('id_empresa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, Number]),
    __metadata("design:returntype", void 0)
], MaestrosController.prototype, "findAllTiposImpuesto", null);
exports.MaestrosController = MaestrosController = __decorate([
    (0, swagger_1.ApiTags)('maestros-terceros'),
    (0, common_1.Controller)('maestros-terceros'),
    (0, common_1.UseGuards)(empresa_guard_1.EmpresaGuard),
    __metadata("design:paramtypes", [maestros_service_1.MaestrosService])
], MaestrosController);
//# sourceMappingURL=maestros.controller.js.map