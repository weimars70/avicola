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
var MovimientosGalponController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovimientosGalponController = void 0;
const common_1 = require("@nestjs/common");
const movimientos_galpon_service_1 = require("./movimientos-galpon.service");
const create_detalle_galpon_dto_1 = require("./dto/create-detalle-galpon.dto");
const update_detalle_galpon_dto_1 = require("./dto/update-detalle-galpon.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const empresa_decorator_1 = require("../terceros/decorators/empresa.decorator");
const usuario_decorator_1 = require("../terceros/decorators/usuario.decorator");
const swagger_1 = require("@nestjs/swagger");
let MovimientosGalponController = MovimientosGalponController_1 = class MovimientosGalponController {
    constructor(movimientosService) {
        this.movimientosService = movimientosService;
        this.logger = new common_1.Logger(MovimientosGalponController_1.name);
    }
    async create(createDto, id_empresa, id_usuario) {
        this.logger.log(`Registrando detalle para galpón: ${createDto.id_galpon}`);
        return await this.movimientosService.create(createDto, id_empresa, id_usuario);
    }
    async findByGalpon(id, id_empresa) {
        return await this.movimientosService.findByGalpon(id, id_empresa);
    }
    async findOne(id, id_empresa) {
        return await this.movimientosService.findOne(id, id_empresa);
    }
    async update(id, updateDto, id_empresa, id_usuario) {
        this.logger.log(`Actualizando detalle: ${id}`);
        return await this.movimientosService.update(id, updateDto, id_empresa, id_usuario);
    }
    async remove(id, id_empresa) {
        this.logger.log(`Eliminando detalle: ${id}`);
        await this.movimientosService.remove(id, id_empresa);
        return { success: true, message: 'Detalle eliminado correctamente' };
    }
    async getPoblacion(id, id_empresa) {
        const poblacion = await this.movimientosService.getPoblacionActual(id, id_empresa);
        return { poblacion };
    }
};
exports.MovimientosGalponController = MovimientosGalponController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar un nuevo detalle/actividad en el galpón' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, empresa_decorator_1.IdEmpresa)()),
    __param(2, (0, usuario_decorator_1.IdUsuario)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_detalle_galpon_dto_1.CreateDetalleGalponDto, Number, String]),
    __metadata("design:returntype", Promise)
], MovimientosGalponController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('galpon/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener historial de detalles/actividades de un galpón' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, empresa_decorator_1.IdEmpresa)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], MovimientosGalponController.prototype, "findByGalpon", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un detalle específico' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, empresa_decorator_1.IdEmpresa)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], MovimientosGalponController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un detalle/actividad' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, empresa_decorator_1.IdEmpresa)()),
    __param(3, (0, usuario_decorator_1.IdUsuario)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_detalle_galpon_dto_1.UpdateDetalleGalponDto, Number, String]),
    __metadata("design:returntype", Promise)
], MovimientosGalponController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un detalle/actividad' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, empresa_decorator_1.IdEmpresa)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], MovimientosGalponController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('galpon/:id/poblacion'),
    (0, swagger_1.ApiOperation)({ summary: 'Calcular población actual de aves en un galpón' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, empresa_decorator_1.IdEmpresa)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], MovimientosGalponController.prototype, "getPoblacion", null);
exports.MovimientosGalponController = MovimientosGalponController = MovimientosGalponController_1 = __decorate([
    (0, swagger_1.ApiTags)('movimientos-galpon'),
    (0, common_1.Controller)('movimientos-galpon'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [movimientos_galpon_service_1.MovimientosGalponService])
], MovimientosGalponController);
//# sourceMappingURL=movimientos-galpon.controller.js.map