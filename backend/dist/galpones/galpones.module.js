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
const galpones_controller_1 = require("./galpones.controller");
const galpones_service_1 = require("./galpones.service");
let GalponesModule = class GalponesModule {
};
exports.GalponesModule = GalponesModule;
exports.GalponesModule = GalponesModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([galpon_entity_1.Galpon])],
        controllers: [galpones_controller_1.GalponesController],
        providers: [galpones_service_1.GalponesService],
        exports: [galpones_service_1.GalponesService, typeorm_1.TypeOrmModule.forFeature([galpon_entity_1.Galpon])],
    })
], GalponesModule);
//# sourceMappingURL=galpones.module.js.map