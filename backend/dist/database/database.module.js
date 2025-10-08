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
                    entities: [user_entity_1.User, galpon_entity_1.Galpon, tipo_huevo_entity_1.TipoHuevo, canasta_entity_1.Canasta, entrada_produccion_entity_1.EntradaProduccion, salida_entity_1.Salida, inventario_entity_1.Inventario, ajuste_inventario_entity_1.AjusteInventario, ajuste_lote_entity_1.AjusteLote, categoria_gasto_entity_1.CategoriaGasto, gasto_entity_1.Gasto, ingreso_entity_1.Ingreso, rendimiento_entity_1.Rendimiento],
                    synchronize: configService.get('NODE_ENV') !== 'production',
                    logging: configService.get('NODE_ENV') === 'development',
                }),
                inject: [config_1.ConfigService],
            }),
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map