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
exports.ActividadesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const actividades_service_1 = require("./actividades.service");
let ActividadesController = class ActividadesController {
    constructor(actividadesService) {
        this.actividadesService = actividadesService;
    }
    async getActividadesRecientes(limit) {
        const limitNumber = limit ? parseInt(limit, 10) : 10;
        return this.actividadesService.getActividadesRecientes(limitNumber);
    }
};
exports.ActividadesController = ActividadesController;
__decorate([
    (0, common_1.Get)('recientes'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ActividadesController.prototype, "getActividadesRecientes", null);
exports.ActividadesController = ActividadesController = __decorate([
    (0, common_1.Controller)('actividades'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [actividades_service_1.ActividadesService])
], ActividadesController);
//# sourceMappingURL=actividades.controller.js.map