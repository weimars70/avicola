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
exports.Compra = void 0;
const typeorm_1 = require("typeorm");
const tercero_entity_1 = require("../../terceros/entities/tercero.entity");
const detalle_compra_entity_1 = require("./detalle-compra.entity");
let Compra = class Compra {
};
exports.Compra = Compra;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Compra.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Compra.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Compra.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Compra.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_tercero' }),
    __metadata("design:type", Number)
], Compra.prototype, "idTercero", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_empresa' }),
    __metadata("design:type", Number)
], Compra.prototype, "idEmpresa", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_usuario_inserta', nullable: true }),
    __metadata("design:type", String)
], Compra.prototype, "idUsuarioInserta", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Compra.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'numero_factura', nullable: true, length: 20 }),
    __metadata("design:type", String)
], Compra.prototype, "numeroFactura", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo_movimiento', default: 2 }),
    __metadata("design:type", Number)
], Compra.prototype, "tipoMovimiento", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'createdat', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Compra.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'updatedat', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Compra.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tercero_entity_1.Tercero),
    (0, typeorm_1.JoinColumn)({ name: 'id_tercero', referencedColumnName: 'codigo' }),
    __metadata("design:type", tercero_entity_1.Tercero)
], Compra.prototype, "tercero", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => detalle_compra_entity_1.DetalleCompra, detalle => detalle.compra, { cascade: true }),
    __metadata("design:type", Array)
], Compra.prototype, "detalles", void 0);
exports.Compra = Compra = __decorate([
    (0, typeorm_1.Entity)('compras')
], Compra);
//# sourceMappingURL=compra.entity.js.map