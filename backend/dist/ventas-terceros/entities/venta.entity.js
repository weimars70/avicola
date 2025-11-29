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
exports.Venta = void 0;
const typeorm_1 = require("typeorm");
const tercero_entity_1 = require("../../terceros/entities/tercero.entity");
const detalle_venta_entity_1 = require("./detalle-venta.entity");
let Venta = class Venta {
};
exports.Venta = Venta;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Venta.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Venta.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Venta.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Venta.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_tercero' }),
    __metadata("design:type", Number)
], Venta.prototype, "idTercero", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_empresa' }),
    __metadata("design:type", Number)
], Venta.prototype, "idEmpresa", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_usuario_inserta', nullable: true }),
    __metadata("design:type", String)
], Venta.prototype, "idUsuarioInserta", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Venta.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'numero_factura', nullable: true, length: 50 }),
    __metadata("design:type", String)
], Venta.prototype, "numeroFactura", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'forma_pago', nullable: true, length: 50 }),
    __metadata("design:type", String)
], Venta.prototype, "formaPago", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Venta.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo_movimiento', default: 2 }),
    __metadata("design:type", Number)
], Venta.prototype, "tipoMovimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'PENDIENTE', length: 20 }),
    __metadata("design:type", String)
], Venta.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'createdat', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Venta.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updatedat', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Venta.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_inserta', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Venta.prototype, "fechaInserta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_actualiza', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Venta.prototype, "fechaActualiza", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tercero_entity_1.Tercero),
    (0, typeorm_1.JoinColumn)({ name: 'id_tercero', referencedColumnName: 'codigo' }),
    __metadata("design:type", tercero_entity_1.Tercero)
], Venta.prototype, "tercero", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => detalle_venta_entity_1.DetalleVenta, detalle => detalle.venta),
    __metadata("design:type", Array)
], Venta.prototype, "detalles", void 0);
exports.Venta = Venta = __decorate([
    (0, typeorm_1.Entity)('ventas')
], Venta);
//# sourceMappingURL=venta.entity.js.map