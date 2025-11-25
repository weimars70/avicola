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
exports.Tercero = void 0;
const typeorm_1 = require("typeorm");
let Tercero = class Tercero {
};
exports.Tercero = Tercero;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Tercero.prototype, "codigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'id_empresa', type: 'int', nullable: false }),
    __metadata("design:type", Number)
], Tercero.prototype, "idEmpresa", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ciudad_codigo' }),
    __metadata("design:type", String)
], Tercero.prototype, "ciudadCodigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Tercero.prototype, "identificacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Tercero.prototype, "dv", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Tercero.prototype, "nombres", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'primer_apellido', nullable: true }),
    __metadata("design:type", String)
], Tercero.prototype, "primerApellido", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'segundo_apellido', nullable: true }),
    __metadata("design:type", String)
], Tercero.prototype, "segundoApellido", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Tercero.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Tercero.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Tercero.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Tercero.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'estrato_codigo' }),
    __metadata("design:type", Number)
], Tercero.prototype, "estratoCodigo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Tercero.prototype, "regimen", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'tipo_ident' }),
    __metadata("design:type", Number)
], Tercero.prototype, "tipoIdent", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'tipo_impuesto' }),
    __metadata("design:type", Number)
], Tercero.prototype, "tipoImpuesto", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Tercero.prototype, "cliente", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Tercero.prototype, "proveedor", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Tercero.prototype, "activo", void 0);
exports.Tercero = Tercero = __decorate([
    (0, typeorm_1.Entity)('terceros', { schema: 'public' })
], Tercero);
//# sourceMappingURL=tercero.entity.js.map