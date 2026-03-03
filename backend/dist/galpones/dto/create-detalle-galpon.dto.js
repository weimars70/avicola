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
exports.CreateDetalleGalponDto = void 0;
const class_validator_1 = require("class-validator");
const detalle_galpon_entity_1 = require("../entities/detalle-galpon.entity");
class CreateDetalleGalponDto {
}
exports.CreateDetalleGalponDto = CreateDetalleGalponDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDetalleGalponDto.prototype, "id_galpon", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(detalle_galpon_entity_1.TipoMovimiento),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDetalleGalponDto.prototype, "tipo", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateDetalleGalponDto.prototype, "cantidad", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDetalleGalponDto.prototype, "motivo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateDetalleGalponDto.prototype, "comentario", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateDetalleGalponDto.prototype, "fecha", void 0);
//# sourceMappingURL=create-detalle-galpon.dto.js.map