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
exports.TiposHuevoController = void 0;
const common_1 = require("@nestjs/common");
const tipos_huevo_service_1 = require("./tipos-huevo.service");
const create_tipo_huevo_dto_1 = require("./dto/create-tipo-huevo.dto");
const update_tipo_huevo_dto_1 = require("./dto/update-tipo-huevo.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let TiposHuevoController = class TiposHuevoController {
    constructor(tiposHuevoService) {
        this.tiposHuevoService = tiposHuevoService;
    }
    create(createTipoHuevoDto) {
        return this.tiposHuevoService.create(createTipoHuevoDto);
    }
    findAll() {
        return this.tiposHuevoService.findAll();
    }
    findAllIncludingInactive() {
        return this.tiposHuevoService.findAllIncludingInactive();
    }
    findOne(id) {
        return this.tiposHuevoService.findOne(id);
    }
    update(id, updateTipoHuevoDto) {
        return this.tiposHuevoService.update(id, updateTipoHuevoDto);
    }
    remove(id) {
        return this.tiposHuevoService.remove(id);
    }
};
exports.TiposHuevoController = TiposHuevoController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tipo_huevo_dto_1.CreateTipoHuevoDto]),
    __metadata("design:returntype", void 0)
], TiposHuevoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TiposHuevoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TiposHuevoController.prototype, "findAllIncludingInactive", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TiposHuevoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_tipo_huevo_dto_1.UpdateTipoHuevoDto]),
    __metadata("design:returntype", void 0)
], TiposHuevoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TiposHuevoController.prototype, "remove", null);
exports.TiposHuevoController = TiposHuevoController = __decorate([
    (0, common_1.Controller)('tipos-huevo'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [tipos_huevo_service_1.TiposHuevoService])
], TiposHuevoController);
//# sourceMappingURL=tipos-huevo.controller.js.map