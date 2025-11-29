"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../users/entities/user.entity");
const galpon_entity_1 = require("../galpones/entities/galpon.entity");
const tipo_huevo_entity_1 = require("../tipos-huevo/entities/tipo-huevo.entity");
const canasta_entity_1 = require("../canastas/entities/canasta.entity");
const entrada_produccion_entity_1 = require("../entradas-produccion/entities/entrada-produccion.entity");
const salida_entity_1 = require("../salidas/entities/salida.entity");
const inventario_entity_1 = require("../inventario/entities/inventario.entity");
const ajuste_inventario_entity_1 = require("../inventario/entities/ajuste-inventario.entity");
const ajuste_lote_entity_1 = require("../inventario/entities/ajuste-lote.entity");
const categoria_gasto_entity_1 = require("../finanzas/entities/categoria-gasto.entity");
const gasto_entity_1 = require("../finanzas/entities/gasto.entity");
const ingreso_entity_1 = require("../finanzas/entities/ingreso.entity");
const rendimiento_entity_1 = require("../finanzas/entities/rendimiento.entity");
const tercero_entity_1 = require("../terceros/entities/tercero.entity");
const ciudad_entity_1 = require("../terceros/entities/ciudad.entity");
const estrato_entity_1 = require("../terceros/entities/estrato.entity");
const tipo_regimen_entity_1 = require("../terceros/entities/tipo-regimen.entity");
const tipo_ident_entity_1 = require("../terceros/entities/tipo-ident.entity");
const tipo_impuesto_entity_1 = require("../terceros/entities/tipo-impuesto.entity");
const compra_entity_1 = require("../compras-terceros/entities/compra.entity");
const detalle_compra_entity_1 = require("../compras-terceros/entities/detalle-compra.entity");
const venta_entity_1 = require("../ventas-terceros/entities/venta.entity");
const detalle_venta_entity_1 = require("../ventas-terceros/entities/detalle-venta.entity");
const inventario_terceros_entity_1 = require("../inventario-terceros/entities/inventario-terceros.entity");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: parseInt(configService.get('DB_PORT', '5432')),
                    username: configService.get('DB_USERNAME', 'postgres'),
                    password: configService.get('DB_PASSWORD', 'password'),
                    database: configService.get('DB_NAME', 'galpones_db'),
                    entities: [
                        user_entity_1.User, galpon_entity_1.Galpon, tipo_huevo_entity_1.TipoHuevo, canasta_entity_1.Canasta, entrada_produccion_entity_1.EntradaProduccion,
                        salida_entity_1.Salida, inventario_entity_1.Inventario, ajuste_inventario_entity_1.AjusteInventario, ajuste_lote_entity_1.AjusteLote,
                        categoria_gasto_entity_1.CategoriaGasto, gasto_entity_1.Gasto, ingreso_entity_1.Ingreso, rendimiento_entity_1.Rendimiento,
                        tercero_entity_1.Tercero, ciudad_entity_1.Ciudad, estrato_entity_1.Estrato, tipo_regimen_entity_1.TipoRegimen, tipo_ident_entity_1.TipoIdent, tipo_impuesto_entity_1.TipoImpuesto,
                        compra_entity_1.Compra, detalle_compra_entity_1.DetalleCompra, venta_entity_1.Venta, detalle_venta_entity_1.DetalleVenta, inventario_terceros_entity_1.InventarioTerceros
                    ],
                    synchronize: false,
                    logging: configService.get('NODE_ENV') === 'development',
                }),
                inject: [config_1.ConfigService],
            }),
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map