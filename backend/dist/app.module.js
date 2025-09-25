"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const galpones_module_1 = require("./galpones/galpones.module");
const tipos_huevo_module_1 = require("./tipos-huevo/tipos-huevo.module");
const canastas_module_1 = require("./canastas/canastas.module");
const inventario_module_1 = require("./inventario/inventario.module");
const entradas_produccion_module_1 = require("./entradas-produccion/entradas-produccion.module");
const salidas_module_1 = require("./salidas/salidas.module");
const finanzas_module_1 = require("./finanzas/finanzas.module");
const notifications_module_1 = require("./notifications/notifications.module");
const database_module_1 = require("./database/database.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            galpones_module_1.GalponesModule,
            tipos_huevo_module_1.TiposHuevoModule,
            canastas_module_1.CanastasModule,
            inventario_module_1.InventarioModule,
            entradas_produccion_module_1.EntradasProduccionModule,
            salidas_module_1.SalidasModule,
            finanzas_module_1.FinanzasModule,
            notifications_module_1.NotificationsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map