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
exports.CanastasController = void 0;
const common_1 = require("@nestjs/common");
const canastas_service_1 = require("./canastas.service");
const create_canasta_dto_1 = require("./dto/create-canasta.dto");
const update_canasta_dto_1 = require("./dto/update-canasta.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let CanastasController = class CanastasController {
    constructor(canastasService) {
        this.canastasService = canastasService;
    }
    create(createCanastaDto) {
        return this.canastasService.create(createCanastaDto);
    }
    findAll() {
        return this.canastasService.findAll();
    }
    findAllIncludingInactive() {
        return this.canastasService.findAllIncludingInactive();
    }
    findOne(id) {
        return this.canastasService.findOne(id);
    }
    update(id, updateCanastaDto) {
        return this.canastasService.update(id, updateCanastaDto);
    }
    remove(id) {
        return this.canastasService.remove(id);
    }
};
exports.CanastasController = CanastasController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_canasta_dto_1.CreateCanastaDto]),
    __metadata("design:returntype", void 0)
], CanastasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CanastasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CanastasController.prototype, "findAllIncludingInactive", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CanastasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_canasta_dto_1.UpdateCanastaDto]),
    __metadata("design:returntype", void 0)
], CanastasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CanastasController.prototype, "remove", null);
exports.CanastasController = CanastasController = __decorate([
    (0, common_1.Controller)('canastas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [canastas_service_1.CanastasService])
], CanastasController);
//# sourceMappingURL=canastas.controller.js.map