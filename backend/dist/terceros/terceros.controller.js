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
exports.TercerosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const terceros_service_1 = require("./terceros.service");
const create_tercero_dto_1 = require("./dto/create-tercero.dto");
const empresa_decorator_1 = require("./decorators/empresa.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TercerosController = class TercerosController {
    constructor(tercerosService) {
        this.tercerosService = tercerosService;
    }
    async create(createTerceroDto, idEmpresa) {
        console.log('📥 POST /terceros recibido');
        console.log('📦 Body recibido:', createTerceroDto);
        console.log('🏢 ID Empresa:', idEmpresa);
        try {
            const result = await this.tercerosService.create(idEmpresa, createTerceroDto);
            console.log('✅ Tercero creado exitosamente:', result);
            return result;
        }
        catch (error) {
            console.error('❌ Error al crear tercero:', error);
            throw error;
        }
    }
    findAll(idEmpresa) {
        return this.tercerosService.findAll(idEmpresa);
    }
    findActivos(idEmpresa) {
        return this.tercerosService.findActivos(idEmpresa);
    }
    findClientes(idEmpresa) {
        return this.tercerosService.findClientes(idEmpresa);
    }
    findProveedores(idEmpresa) {
        return this.tercerosService.findProveedores(idEmpresa);
    }
    buscarPorIdentificacion(identificacion, idEmpresa) {
        return this.tercerosService.buscarPorIdentificacion(identificacion, idEmpresa);
    }
    buscarPorNombre(nombre, idEmpresa) {
        return this.tercerosService.buscarPorNombre(nombre, idEmpresa);
    }
    findOne(codigo, idEmpresa) {
        return this.tercerosService.findOne(codigo, idEmpresa);
    }
    update(codigo, updateTerceroDto, idEmpresa) {
        return this.tercerosService.update(codigo, updateTerceroDto, idEmpresa);
    }
    remove(codigo, idEmpresa) {
        return this.tercerosService.remove(codigo, idEmpresa);
    }
};
exports.TercerosController = TercerosController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo tercero' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tercero_dto_1.CreateTerceroDto, Number]),
    __metadata("design:returntype", Promise)
], TercerosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los terceros' }),
    __param(0, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TercerosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('activos'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener terceros activos' }),
    __param(0, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TercerosController.prototype, "findActivos", null);
__decorate([
    (0, common_1.Get)('clientes'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener clientes activos' }),
    __param(0, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TercerosController.prototype, "findClientes", null);
__decorate([
    (0, common_1.Get)('proveedores'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener proveedores activos' }),
    __param(0, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TercerosController.prototype, "findProveedores", null);
__decorate([
    (0, common_1.Get)('buscar/identificacion'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar por identificación' }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], TercerosController.prototype, "buscarPorIdentificacion", null);
__decorate([
    (0, common_1.Get)('buscar/nombre'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar por nombre' }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], TercerosController.prototype, "buscarPorNombre", null);
__decorate([
    (0, common_1.Get)(':codigo'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un tercero por código' }),
    __param(0, (0, common_1.Param)('codigo', common_1.ParseIntPipe)),
    __param(1, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], TercerosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':codigo'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un tercero' }),
    __param(0, (0, common_1.Param)('codigo', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, create_tercero_dto_1.UpdateTerceroDto, Number]),
    __metadata("design:returntype", void 0)
], TercerosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':codigo'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un tercero' }),
    __param(0, (0, common_1.Param)('codigo', common_1.ParseIntPipe)),
    __param(1, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], TercerosController.prototype, "remove", null);
exports.TercerosController = TercerosController = __decorate([
    (0, swagger_1.ApiTags)('terceros'),
    (0, common_1.Controller)('terceros'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [terceros_service_1.TercerosService])
], TercerosController);
//# sourceMappingURL=terceros.controller.js.map