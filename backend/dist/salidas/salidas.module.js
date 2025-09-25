"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalidasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const salidas_service_1 = require("./salidas.service");
const salidas_controller_1 = require("./salidas.controller");
const salida_entity_1 = require("./entities/salida.entity");
const tipos_huevo_module_1 = require("../tipos-huevo/tipos-huevo.module");
const canastas_module_1 = require("../canastas/canastas.module");
const inventario_module_1 = require("../inventario/inventario.module");
const finanzas_module_1 = require("../finanzas/finanzas.module");
let SalidasModule = class SalidasModule {
};
exports.SalidasModule = SalidasModule;
exports.SalidasModule = SalidasModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([salida_entity_1.Salida]),
            tipos_huevo_module_1.TiposHuevoModule,
            canastas_module_1.CanastasModule,
            inventario_module_1.InventarioModule,
            (0, common_1.forwardRef)(() => finanzas_module_1.FinanzasModule),
        ],
        controllers: [salidas_controller_1.SalidasController],
        providers: [salidas_service_1.SalidasService],
        exports: [salidas_service_1.SalidasService],
    })
], SalidasModule);
//# sourceMappingURL=salidas.module.js.map