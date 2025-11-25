"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComprasTercerosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const compras_terceros_service_1 = require("./compras-terceros.service");
const compras_terceros_controller_1 = require("./compras-terceros.controller");
const compra_entity_1 = require("./entities/compra.entity");
const detalle_compra_entity_1 = require("./entities/detalle-compra.entity");
const finanzas_module_1 = require("../finanzas/finanzas.module");
let ComprasTercerosModule = class ComprasTercerosModule {
};
exports.ComprasTercerosModule = ComprasTercerosModule;
exports.ComprasTercerosModule = ComprasTercerosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([compra_entity_1.Compra, detalle_compra_entity_1.DetalleCompra]), (0, common_1.forwardRef)(() => finanzas_module_1.FinanzasModule)],
        controllers: [compras_terceros_controller_1.ComprasTercerosController],
        providers: [compras_terceros_service_1.ComprasTercerosService],
        exports: [compras_terceros_service_1.ComprasTercerosService],
    })
], ComprasTercerosModule);
//# sourceMappingURL=compras-terceros.module.js.map