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
exports.Inventario = void 0;
const typeorm_1 = require("typeorm");
const tipo_huevo_entity_1 = require("../../tipos-huevo/entities/tipo-huevo.entity");
let Inventario = class Inventario {
};
exports.Inventario = Inventario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Inventario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Inventario.prototype, "tipoHuevoId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Inventario.prototype, "unidades", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Inventario.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Inventario.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tipo_huevo_entity_1.TipoHuevo),
    (0, typeorm_1.JoinColumn)({ name: 'tipoHuevoId' }),
    __metadata("design:type", tipo_huevo_entity_1.TipoHuevo)
], Inventario.prototype, "tipoHuevo", void 0);
exports.Inventario = Inventario = __decorate([
    (0, typeorm_1.Entity)('inventario'),
    (0, typeorm_1.Unique)(['tipoHuevoId'])
], Inventario);
//# sourceMappingURL=inventario.entity.js.map