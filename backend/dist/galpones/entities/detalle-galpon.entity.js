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
exports.DetalleGalpon = exports.TipoMovimiento = void 0;
const typeorm_1 = require("typeorm");
const galpon_entity_1 = require("./galpon.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var TipoMovimiento;
(function (TipoMovimiento) {
    TipoMovimiento["SUMA"] = "SUMA";
    TipoMovimiento["RESTA"] = "RESTA";
})(TipoMovimiento || (exports.TipoMovimiento = TipoMovimiento = {}));
let DetalleGalpon = class DetalleGalpon {
};
exports.DetalleGalpon = DetalleGalpon;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], DetalleGalpon.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], DetalleGalpon.prototype, "id_galpon", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 10,
        enum: TipoMovimiento
    }),
    __metadata("design:type", String)
], DetalleGalpon.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], DetalleGalpon.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], DetalleGalpon.prototype, "motivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], DetalleGalpon.prototype, "comentario", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], DetalleGalpon.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], DetalleGalpon.prototype, "id_empresa", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: false }),
    __metadata("design:type", String)
], DetalleGalpon.prototype, "id_usuario_inserta", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], DetalleGalpon.prototype, "id_usuario_actualiza", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], DetalleGalpon.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], DetalleGalpon.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => galpon_entity_1.Galpon),
    (0, typeorm_1.JoinColumn)({ name: 'id_galpon' }),
    __metadata("design:type", galpon_entity_1.Galpon)
], DetalleGalpon.prototype, "galpon", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'id_usuario_inserta' }),
    __metadata("design:type", user_entity_1.User)
], DetalleGalpon.prototype, "usuarioInserta", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'id_usuario_actualiza' }),
    __metadata("design:type", user_entity_1.User)
], DetalleGalpon.prototype, "usuarioActualiza", void 0);
exports.DetalleGalpon = DetalleGalpon = __decorate([
    (0, typeorm_1.Entity)('detalles_galpones')
], DetalleGalpon);
//# sourceMappingURL=detalle-galpon.entity.js.map