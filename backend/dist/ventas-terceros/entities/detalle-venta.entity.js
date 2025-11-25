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
exports.DetalleVenta = void 0;
const typeorm_1 = require("typeorm");
const venta_entity_1 = require("./venta.entity");
const canasta_entity_1 = require("../../canastas/entities/canasta.entity");
let DetalleVenta = class DetalleVenta {
};
exports.DetalleVenta = DetalleVenta;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DetalleVenta.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_venta' }),
    __metadata("design:type", String)
], DetalleVenta.prototype, "idVenta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_producto', nullable: true }),
    __metadata("design:type", String)
], DetalleVenta.prototype, "idProducto", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DetalleVenta.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 1 }),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'precio_unitario', type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "precioUnitario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'canasta_id' }),
    __metadata("design:type", String)
], DetalleVenta.prototype, "canastaId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 50 }),
    __metadata("design:type", String)
], DetalleVenta.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_inserta', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], DetalleVenta.prototype, "fechaInserta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'inventario_origen', default: 1 }),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "inventarioOrigen", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => venta_entity_1.Venta, venta => venta.detalles, { onDelete: 'NO ACTION' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_venta' }),
    __metadata("design:type", venta_entity_1.Venta)
], DetalleVenta.prototype, "venta", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => canasta_entity_1.Canasta, { onDelete: 'NO ACTION' }),
    (0, typeorm_1.JoinColumn)({ name: 'canasta_id' }),
    __metadata("design:type", canasta_entity_1.Canasta)
], DetalleVenta.prototype, "canasta", void 0);
exports.DetalleVenta = DetalleVenta = __decorate([
    (0, typeorm_1.Entity)('detalle_ventas')
], DetalleVenta);
//# sourceMappingURL=detalle-venta.entity.js.map