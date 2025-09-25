"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntradasProduccionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const entradas_produccion_service_1 = require("./entradas-produccion.service");
const entradas_produccion_controller_1 = require("./entradas-produccion.controller");
const entrada_produccion_entity_1 = require("./entities/entrada-produccion.entity");
const galpones_module_1 = require("../galpones/galpones.module");
const tipos_huevo_module_1 = require("../tipos-huevo/tipos-huevo.module");
const inventario_module_1 = require("../inventario/inventario.module");
let EntradasProduccionModule = class EntradasProduccionModule {
};
exports.EntradasProduccionModule = EntradasProduccionModule;
exports.EntradasProduccionModule = EntradasProduccionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([entrada_produccion_entity_1.EntradaProduccion]),
            galpones_module_1.GalponesModule,
            tipos_huevo_module_1.TiposHuevoModule,
            inventario_module_1.InventarioModule,
        ],
        controllers: [entradas_produccion_controller_1.EntradasProduccionController],
        providers: [entradas_produccion_service_1.EntradasProduccionService],
        exports: [entradas_produccion_service_1.EntradasProduccionService],
    })
], EntradasProduccionModule);
//# sourceMappingURL=entradas-produccion.module.js.map