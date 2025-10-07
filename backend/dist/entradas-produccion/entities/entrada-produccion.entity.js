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
exports.EntradaProduccion = void 0;
const typeorm_1 = require("typeorm");
const galpon_entity_1 = require("../../galpones/entities/galpon.entity");
const tipo_huevo_entity_1 = require("../../tipos-huevo/entities/tipo-huevo.entity");
let EntradaProduccion = class EntradaProduccion {
};
exports.EntradaProduccion = EntradaProduccion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EntradaProduccion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EntradaProduccion.prototype, "galponId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], EntradaProduccion.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EntradaProduccion.prototype, "tipoHuevoId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], EntradaProduccion.prototype, "unidades", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], EntradaProduccion.prototype, "id_empresa", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], EntradaProduccion.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], EntradaProduccion.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => galpon_entity_1.Galpon),
    (0, typeorm_1.JoinColumn)({ name: 'galponId' }),
    __metadata("design:type", galpon_entity_1.Galpon)
], EntradaProduccion.prototype, "galpon", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tipo_huevo_entity_1.TipoHuevo),
    (0, typeorm_1.JoinColumn)({ name: 'tipoHuevoId' }),
    __metadata("design:type", tipo_huevo_entity_1.TipoHuevo)
], EntradaProduccion.prototype, "tipoHuevo", void 0);
exports.EntradaProduccion = EntradaProduccion = __decorate([
    (0, typeorm_1.Entity)('entradas_produccion')
], EntradaProduccion);
//# sourceMappingURL=entrada-produccion.entity.js.map