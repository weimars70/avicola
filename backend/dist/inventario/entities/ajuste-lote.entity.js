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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AjusteLote = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const ajuste_inventario_entity_1 = require("./ajuste-inventario.entity");
let AjusteLote = class AjusteLote {
};
exports.AjusteLote = AjusteLote;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AjusteLote.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AjusteLote.prototype, "descripcionGeneral", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AjusteLote.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', default: 1 }),
    __metadata("design:type", Number)
], AjusteLote.prototype, "id_empresa", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], AjusteLote.prototype, "id_usuario_inserta", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], AjusteLote.prototype, "id_usuario_actualiza", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AjusteLote.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AjusteLote.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'usuarioId' }),
    __metadata("design:type", user_entity_1.User)
], AjusteLote.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ajuste_inventario_entity_1.AjusteInventario, ajuste => ajuste.ajusteLote),
    __metadata("design:type", Array)
], AjusteLote.prototype, "ajustes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'id_usuario_inserta' }),
    __metadata("design:type", user_entity_1.User)
], AjusteLote.prototype, "usuarioInserta", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'id_usuario_actualiza' }),
    __metadata("design:type", user_entity_1.User)
], AjusteLote.prototype, "usuarioActualiza", void 0);
exports.AjusteLote = AjusteLote = __decorate([
    (0, typeorm_1.Entity)('ajustes_lote')
], AjusteLote);
//# sourceMappingURL=ajuste-lote.entity.js.map