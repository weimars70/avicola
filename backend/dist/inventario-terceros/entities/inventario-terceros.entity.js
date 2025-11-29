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
exports.InventarioTerceros = void 0;
const typeorm_1 = require("typeorm");
let InventarioTerceros = class InventarioTerceros {
};
exports.InventarioTerceros = InventarioTerceros;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], InventarioTerceros.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_empresa', type: 'int' }),
    __metadata("design:type", Number)
], InventarioTerceros.prototype, "idEmpresa", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_tercero', type: 'int' }),
    __metadata("design:type", Number)
], InventarioTerceros.prototype, "idTercero", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo_huevo_codigo', type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], InventarioTerceros.prototype, "tipoHuevoCodigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cantidad', type: 'int' }),
    __metadata("design:type", Number)
], InventarioTerceros.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo_movimiento', type: 'varchar', length: 10 }),
    __metadata("design:type", String)
], InventarioTerceros.prototype, "tipoMovimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'precio_unitario', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], InventarioTerceros.prototype, "precioUnitario", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'valor_total', type: 'decimal', precision: 15, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], InventarioTerceros.prototype, "valorTotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_movimiento_financiero', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], InventarioTerceros.prototype, "idMovimientoFinanciero", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_compra', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], InventarioTerceros.prototype, "idCompra", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_venta', type: 'int', nullable: true }),
    __metadata("design:type", Number)
], InventarioTerceros.prototype, "idVenta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lote', type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], InventarioTerceros.prototype, "lote", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_movimiento', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], InventarioTerceros.prototype, "fechaMovimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'concepto', type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], InventarioTerceros.prototype, "concepto", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'descripcion', type: 'text', nullable: true }),
    __metadata("design:type", String)
], InventarioTerceros.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_anterior', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], InventarioTerceros.prototype, "stockAnterior", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'stock_actual', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], InventarioTerceros.prototype, "stockActual", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'activo', type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], InventarioTerceros.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], InventarioTerceros.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], InventarioTerceros.prototype, "updatedAt", void 0);
exports.InventarioTerceros = InventarioTerceros = __decorate([
    (0, typeorm_1.Entity)('inventario_terceros', { schema: 'public' })
], InventarioTerceros);
//# sourceMappingURL=inventario-terceros.entity.js.map