"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentasTercerosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ventas_terceros_service_1 = require("./ventas-terceros.service");
const ventas_terceros_controller_1 = require("./ventas-terceros.controller");
const venta_entity_1 = require("./entities/venta.entity");
const detalle_venta_entity_1 = require("./entities/detalle-venta.entity");
const finanzas_module_1 = require("../finanzas/finanzas.module");
let VentasTercerosModule = class VentasTercerosModule {
};
exports.VentasTercerosModule = VentasTercerosModule;
exports.VentasTercerosModule = VentasTercerosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([venta_entity_1.Venta, detalle_venta_entity_1.DetalleVenta]), (0, common_1.forwardRef)(() => finanzas_module_1.FinanzasModule)],
        controllers: [ventas_terceros_controller_1.VentasTercerosController],
        providers: [ventas_terceros_service_1.VentasTercerosService],
        exports: [ventas_terceros_service_1.VentasTercerosService],
    })
], VentasTercerosModule);
//# sourceMappingURL=ventas-terceros.module.js.map