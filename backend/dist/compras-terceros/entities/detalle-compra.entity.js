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
exports.DetalleCompra = void 0;
const typeorm_1 = require("typeorm");
const compra_entity_1 = require("./compra.entity");
const tipo_huevo_entity_1 = require("../../tipos-huevo/entities/tipo-huevo.entity");
const canasta_entity_1 = require("../../canastas/entities/canasta.entity");
let DetalleCompra = class DetalleCompra {
};
exports.DetalleCompra = DetalleCompra;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DetalleCompra.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_compra' }),
    __metadata("design:type", String)
], DetalleCompra.prototype, "idCompra", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_producto', nullable: true }),
    __metadata("design:type", String)
], DetalleCompra.prototype, "idProducto", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DetalleCompra.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 1 }),
    __metadata("design:type", Number)
], DetalleCompra.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'precio_unitario', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], DetalleCompra.prototype, "precioUnitario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo_huevo_id', nullable: true }),
    __metadata("design:type", String)
], DetalleCompra.prototype, "tipoHuevoId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'canasta_id', nullable: true }),
    __metadata("design:type", String)
], DetalleCompra.prototype, "canastaId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo_movimiento', default: 1 }),
    __metadata("design:type", Number)
], DetalleCompra.prototype, "tipoMovimiento", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => compra_entity_1.Compra, compra => compra.detalles, { onDelete: 'NO ACTION' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_compra' }),
    __metadata("design:type", compra_entity_1.Compra)
], DetalleCompra.prototype, "compra", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tipo_huevo_entity_1.TipoHuevo, { onDelete: 'NO ACTION' }),
    (0, typeorm_1.JoinColumn)({ name: 'tipo_huevo_id' }),
    __metadata("design:type", tipo_huevo_entity_1.TipoHuevo)
], DetalleCompra.prototype, "tipoHuevo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => canasta_entity_1.Canasta, { onDelete: 'RESTRICT' }),
    (0, typeorm_1.JoinColumn)({ name: 'canasta_id' }),
    __metadata("design:type", canasta_entity_1.Canasta)
], DetalleCompra.prototype, "canasta", void 0);
exports.DetalleCompra = DetalleCompra = __decorate([
    (0, typeorm_1.Entity)('detalle_compras')
], DetalleCompra);
//# sourceMappingURL=detalle-compra.entity.js.map