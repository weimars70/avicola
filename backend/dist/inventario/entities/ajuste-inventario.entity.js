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
exports.AjusteInventario = void 0;
const typeorm_1 = require("typeorm");
const tipo_huevo_entity_1 = require("../../tipos-huevo/entities/tipo-huevo.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const ajuste_lote_entity_1 = require("./ajuste-lote.entity");
let AjusteInventario = class AjusteInventario {
};
exports.AjusteInventario = AjusteInventario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AjusteInventario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AjusteInventario.prototype, "tipoHuevoId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], AjusteInventario.prototype, "cantidadAnterior", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], AjusteInventario.prototype, "cantidadAjuste", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], AjusteInventario.prototype, "cantidadNueva", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['suma', 'resta'] }),
    __metadata("design:type", String)
], AjusteInventario.prototype, "tipoAjuste", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AjusteInventario.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AjusteInventario.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AjusteInventario.prototype, "ajusteLoteId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AjusteInventario.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tipo_huevo_entity_1.TipoHuevo),
    (0, typeorm_1.JoinColumn)({ name: 'tipoHuevoId' }),
    __metadata("design:type", tipo_huevo_entity_1.TipoHuevo)
], AjusteInventario.prototype, "tipoHuevo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'usuarioId' }),
    __metadata("design:type", user_entity_1.User)
], AjusteInventario.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ajuste_lote_entity_1.AjusteLote, lote => lote.ajustes),
    (0, typeorm_1.JoinColumn)({ name: 'ajusteLoteId' }),
    __metadata("design:type", ajuste_lote_entity_1.AjusteLote)
], AjusteInventario.prototype, "ajusteLote", void 0);
exports.AjusteInventario = AjusteInventario = __decorate([
    (0, typeorm_1.Entity)('ajustes_inventario')
], AjusteInventario);
//# sourceMappingURL=ajuste-inventario.entity.js.map