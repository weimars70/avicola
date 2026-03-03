"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalponesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const galpon_entity_1 = require("./entities/galpon.entity");
const detalle_galpon_entity_1 = require("./entities/detalle-galpon.entity");
const galpones_controller_1 = require("./galpones.controller");
const galpones_service_1 = require("./galpones.service");
const movimientos_galpon_controller_1 = require("./movimientos-galpon.controller");
const movimientos_galpon_service_1 = require("./movimientos-galpon.service");
let GalponesModule = class GalponesModule {
};
exports.GalponesModule = GalponesModule;
exports.GalponesModule = GalponesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([galpon_entity_1.Galpon, detalle_galpon_entity_1.DetalleGalpon])],
        controllers: [galpones_controller_1.GalponesController, movimientos_galpon_controller_1.MovimientosGalponController],
        providers: [galpones_service_1.GalponesService, movimientos_galpon_service_1.MovimientosGalponService],
        exports: [galpones_service_1.GalponesService, movimientos_galpon_service_1.MovimientosGalponService, typeorm_1.TypeOrmModule.forFeature([galpon_entity_1.Galpon, detalle_galpon_entity_1.DetalleGalpon])],
    })
], GalponesModule);
//# sourceMappingURL=galpones.module.js.map