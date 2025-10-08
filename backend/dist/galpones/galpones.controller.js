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
var GalponesController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalponesController = void 0;
const common_1 = require("@nestjs/common");
const galpones_service_1 = require("./galpones.service");
const create_galpon_dto_1 = require("./dto/create-galpon.dto");
const update_galpon_dto_1 = require("./dto/update-galpon.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let GalponesController = GalponesController_1 = class GalponesController {
    constructor(galponesService) {
        this.galponesService = galponesService;
        this.logger = new common_1.Logger(GalponesController_1.name);
    }
    async create(createGalponDto) {
        this.logger.log('=== INICIO CREACIÓN GALPÓN ===');
        this.logger.log('Datos recibidos:', JSON.stringify(createGalponDto));
        try {
            const resultado = await this.galponesService.create(createGalponDto);
            this.logger.log('Galpón creado exitosamente:', JSON.stringify(resultado));
            this.logger.log('=== FIN CREACIÓN GALPÓN (ÉXITO) ===');
            return resultado;
        }
        catch (error) {
            this.logger.error('Error al crear galpón:', error.message);
            this.logger.error('Stack trace:', error.stack);
            this.logger.log('=== FIN CREACIÓN GALPÓN (ERROR) ===');
            throw error;
        }
    }
    findAll(id_empresa) {
        return this.galponesService.findAll(id_empresa);
    }
    findAllIncludingInactive() {
        return this.galponesService.findAllIncludingInactive();
    }
    findOne(id) {
        return this.galponesService.findOne(id);
    }
    async update(id, updateGalponDto) {
        this.logger.log('=== INICIO ACTUALIZACIÓN GALPÓN ===');
        this.logger.log('ID recibido en controlador:', id);
        this.logger.log('DTO recibido en controlador:', JSON.stringify(updateGalponDto));
        try {
            const resultado = await this.galponesService.update(id, updateGalponDto);
            this.logger.log('Galpón actualizado exitosamente:', JSON.stringify(resultado));
            this.logger.log('=== FIN ACTUALIZACIÓN GALPÓN (ÉXITO) ===');
            return resultado;
        }
        catch (error) {
            this.logger.error('Error al actualizar galpón:', error.message);
            this.logger.error('Stack trace:', error.stack);
            this.logger.log('=== FIN ACTUALIZACIÓN GALPÓN (ERROR) ===');
            throw error;
        }
    }
    async inactivate(id) {
        this.logger.log('=== INICIO INACTIVACIÓN GALPÓN ===');
        this.logger.log('ID recibido:', id);
        try {
            await this.galponesService.remove(id);
            this.logger.log('Galpón inactivado exitosamente');
            this.logger.log('=== FIN INACTIVACIÓN GALPÓN (ÉXITO) ===');
            return { message: 'Galpón inactivado exitosamente' };
        }
        catch (error) {
            this.logger.error('Error al inactivar galpón:', error.message);
            this.logger.error('Stack trace:', error.stack);
            this.logger.log('=== FIN INACTIVACIÓN GALPÓN (ERROR) ===');
            throw error;
        }
    }
    async reactivate(id) {
        this.logger.log('=== INICIO REACTIVACIÓN GALPÓN ===');
        this.logger.log('ID recibido:', id);
        try {
            await this.galponesService.reactivate(id);
            this.logger.log('Galpón reactivado exitosamente');
            this.logger.log('=== FIN REACTIVACIÓN GALPÓN (ÉXITO) ===');
            return { message: 'Galpón reactivado exitosamente' };
        }
        catch (error) {
            this.logger.error('Error al reactivar galpón:', error.message);
            this.logger.error('Stack trace:', error.stack);
            this.logger.log('=== FIN REACTIVACIÓN GALPÓN (ERROR) ===');
            throw error;
        }
    }
};
exports.GalponesController = GalponesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_galpon_dto_1.CreateGalponDto]),
    __metadata("design:returntype", Promise)
], GalponesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('id_empresa', new common_1.ParseIntPipe({ errorHttpStatusCode: 400 }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GalponesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GalponesController.prototype, "findAllIncludingInactive", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GalponesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_galpon_dto_1.UpdateGalponDto]),
    __metadata("design:returntype", Promise)
], GalponesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/inactivar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GalponesController.prototype, "inactivate", null);
__decorate([
    (0, common_1.Patch)(':id/reactivar'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GalponesController.prototype, "reactivate", null);
exports.GalponesController = GalponesController = GalponesController_1 = __decorate([
    (0, common_1.Controller)('galpones'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [galpones_service_1.GalponesService])
], GalponesController);
//# sourceMappingURL=galpones.controller.js.map