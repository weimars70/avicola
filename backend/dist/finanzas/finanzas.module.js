"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanzasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const categoria_gasto_entity_1 = require("./entities/categoria-gasto.entity");
const gasto_entity_1 = require("./entities/gasto.entity");
const ingreso_entity_1 = require("./entities/ingreso.entity");
const rendimiento_entity_1 = require("./entities/rendimiento.entity");
const gastos_service_1 = require("./gastos.service");
const categorias_gastos_service_1 = require("./categorias-gastos.service");
const ingresos_service_1 = require("./ingresos.service");
const rendimiento_service_1 = require("./rendimiento.service");
const gastos_controller_1 = require("./gastos.controller");
const categorias_gastos_controller_1 = require("./categorias-gastos.controller");
const ingresos_controller_1 = require("./ingresos.controller");
const rendimiento_controller_1 = require("./rendimiento.controller");
const finanzas_controller_1 = require("./finanzas.controller");
const actividades_controller_1 = require("./actividades.controller");
const resumen_service_1 = require("./resumen.service");
const actividades_service_1 = require("./actividades.service");
const salidas_module_1 = require("../salidas/salidas.module");
const galpones_module_1 = require("../galpones/galpones.module");
const entradas_produccion_module_1 = require("../entradas-produccion/entradas-produccion.module");
const inventario_module_1 = require("../inventario/inventario.module");
const tipos_huevo_module_1 = require("../tipos-huevo/tipos-huevo.module");
const compra_entity_1 = require("../compras-terceros/entities/compra.entity");
const venta_entity_1 = require("../ventas-terceros/entities/venta.entity");
let FinanzasModule = class FinanzasModule {
};
exports.FinanzasModule = FinanzasModule;
exports.FinanzasModule = FinanzasModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([categoria_gasto_entity_1.CategoriaGasto, gasto_entity_1.Gasto, ingreso_entity_1.Ingreso, rendimiento_entity_1.Rendimiento, compra_entity_1.Compra, venta_entity_1.Venta]),
            (0, common_1.forwardRef)(() => salidas_module_1.SalidasModule),
            galpones_module_1.GalponesModule,
            entradas_produccion_module_1.EntradasProduccionModule,
            inventario_module_1.InventarioModule,
            tipos_huevo_module_1.TiposHuevoModule,
        ],
        controllers: [gastos_controller_1.GastosController, categorias_gastos_controller_1.CategoriasGastosController, ingresos_controller_1.IngresosController, rendimiento_controller_1.RendimientoController, finanzas_controller_1.FinanzasController, actividades_controller_1.ActividadesController],
        providers: [gastos_service_1.GastosService, categorias_gastos_service_1.CategoriasGastosService, ingresos_service_1.IngresosService, rendimiento_service_1.RendimientoService, resumen_service_1.ResumenService, actividades_service_1.ActividadesService],
        exports: [gastos_service_1.GastosService, categorias_gastos_service_1.CategoriasGastosService, ingresos_service_1.IngresosService, rendimiento_service_1.RendimientoService, resumen_service_1.ResumenService, actividades_service_1.ActividadesService],
    })
], FinanzasModule);
//# sourceMappingURL=finanzas.module.js.map