"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventarioModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const inventario_entity_1 = require("./entities/inventario.entity");
const ajuste_inventario_entity_1 = require("./entities/ajuste-inventario.entity");
const ajuste_lote_entity_1 = require("./entities/ajuste-lote.entity");
const entrada_produccion_entity_1 = require("../entradas-produccion/entities/entrada-produccion.entity");
const salida_entity_1 = require("../salidas/entities/salida.entity");
const inventario_stock_controller_1 = require("./inventario-stock.controller");
const inventario_stock_service_1 = require("./inventario-stock.service");
const ajustes_inventario_controller_1 = require("./ajustes-inventario.controller");
const ajustes_inventario_service_1 = require("./ajustes-inventario.service");
const resumen_controller_1 = require("./resumen.controller");
const resumen_service_1 = require("./resumen.service");
const galpones_module_1 = require("../galpones/galpones.module");
const tipos_huevo_module_1 = require("../tipos-huevo/tipos-huevo.module");
const canastas_module_1 = require("../canastas/canastas.module");
const users_module_1 = require("../users/users.module");
let InventarioModule = class InventarioModule {
};
exports.InventarioModule = InventarioModule;
exports.InventarioModule = InventarioModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([inventario_entity_1.Inventario, ajuste_inventario_entity_1.AjusteInventario, ajuste_lote_entity_1.AjusteLote, entrada_produccion_entity_1.EntradaProduccion, salida_entity_1.Salida]),
            galpones_module_1.GalponesModule,
            tipos_huevo_module_1.TiposHuevoModule,
            canastas_module_1.CanastasModule,
            users_module_1.UsersModule,
        ],
        controllers: [inventario_stock_controller_1.InventarioStockController, ajustes_inventario_controller_1.AjustesInventarioController, resumen_controller_1.ResumenController],
        providers: [inventario_stock_service_1.InventarioStockService, ajustes_inventario_service_1.AjustesInventarioService, resumen_service_1.ResumenService],
        exports: [inventario_stock_service_1.InventarioStockService, ajustes_inventario_service_1.AjustesInventarioService, resumen_service_1.ResumenService],
    })
], InventarioModule);
//# sourceMappingURL=inventario.module.js.map