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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let NotificationsController = class NotificationsController {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async getNotificationStream(token, res) {
        if (!token) {
            return res.status(401).json({ message: 'Token requerido' });
        }
        try {
            const decoded = this.jwtService.verify(token);
            if (!decoded) {
                return res.status(401).json({ message: 'Token inválido' });
            }
        }
        catch (error) {
            return res.status(401).json({ message: 'Token inválido o expirado' });
        }
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');
        res.write('data: {"type":"connected","message":""}\n\n');
        const keepAlive = setInterval(() => {
            res.write('data: {"type":"heartbeat","timestamp":"' + new Date().toISOString() + '"}\n\n');
        }, 30000);
        res.on('close', () => {
            clearInterval(keepAlive);
        });
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)('stream'),
    __param(0, (0, common_1.Query)('token')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "getNotificationStream", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map