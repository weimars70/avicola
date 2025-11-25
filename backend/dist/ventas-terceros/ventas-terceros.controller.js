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
exports.VentasTercerosController = void 0;
const common_1 = require("@nestjs/common");
const ventas_terceros_service_1 = require("./ventas-terceros.service");
const create_venta_dto_1 = require("./dto/create-venta.dto");
const update_venta_dto_1 = require("./dto/update-venta.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const empresa_decorator_1 = require("../terceros/decorators/empresa.decorator");
let VentasTercerosController = class VentasTercerosController {
    constructor(ventasTercerosService) {
        this.ventasTercerosService = ventasTercerosService;
    }
    create(createVentaDto, req) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const idEmpresa = (_e = (_d = (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a.idEmpresa) !== null && _b !== void 0 ? _b : (_c = req.user) === null || _c === void 0 ? void 0 : _c.id_empresa) !== null && _d !== void 0 ? _d : Number(req.headers['x-empresa-id'])) !== null && _e !== void 0 ? _e : 0;
        const idUsuario = ((_f = req.query) === null || _f === void 0 ? void 0 : _f.id_usuario_inserta) || ((_g = req.user) === null || _g === void 0 ? void 0 : _g.userId) || ((_h = req.user) === null || _h === void 0 ? void 0 : _h.id_usuario) || '';
        return this.ventasTercerosService.create(createVentaDto, idEmpresa, idUsuario);
    }
    findAll(idEmpresa) {
        return this.ventasTercerosService.findAll(idEmpresa);
    }
    getEstadisticas(idEmpresa) {
        return this.ventasTercerosService.getEstadisticas(idEmpresa);
    }
    findOne(id, idEmpresa) {
        return this.ventasTercerosService.findOne(id, idEmpresa);
    }
    update(id, updateVentaDto, idEmpresa) {
        return this.ventasTercerosService.update(id, updateVentaDto, idEmpresa);
    }
    remove(id, idEmpresa) {
        return this.ventasTercerosService.remove(id, idEmpresa);
    }
};
exports.VentasTercerosController = VentasTercerosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_venta_dto_1.CreateVentaDto, Object]),
    __metadata("design:returntype", void 0)
], VentasTercerosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VentasTercerosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('estadisticas'),
    __param(0, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VentasTercerosController.prototype, "getEstadisticas", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], VentasTercerosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_venta_dto_1.UpdateVentaDto, Number]),
    __metadata("design:returntype", void 0)
], VentasTercerosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], VentasTercerosController.prototype, "remove", null);
exports.VentasTercerosController = VentasTercerosController = __decorate([
    (0, common_1.Controller)('ventas-terceros'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [ventas_terceros_service_1.VentasTercerosService])
], VentasTercerosController);
//# sourceMappingURL=ventas-terceros.controller.js.map