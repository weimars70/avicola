"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TercerosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const terceros_controller_1 = require("./terceros.controller");
const terceros_service_1 = require("./terceros.service");
const maestros_controller_1 = require("./maestros.controller");
const maestros_service_1 = require("./maestros.service");
const tercero_entity_1 = require("./entities/tercero.entity");
const ciudad_entity_1 = require("./entities/ciudad.entity");
const estrato_entity_1 = require("./entities/estrato.entity");
const tipo_regimen_entity_1 = require("./entities/tipo-regimen.entity");
const tipo_ident_entity_1 = require("./entities/tipo-ident.entity");
const tipo_impuesto_entity_1 = require("./entities/tipo-impuesto.entity");
console.log('📋 CARGANDO TercerosModule...');
let TercerosModule = class TercerosModule {
    constructor() {
        console.log('✅ TercerosModule inicializado correctamente');
        console.log('🎯 Controladores registrados: TercerosController, MaestrosController');
        console.log('⚙️ Servicios registrados: TercerosService, MaestrosService');
    }
};
exports.TercerosModule = TercerosModule;
exports.TercerosModule = TercerosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                tercero_entity_1.Tercero,
                ciudad_entity_1.Ciudad,
                estrato_entity_1.Estrato,
                tipo_regimen_entity_1.TipoRegimen,
                tipo_ident_entity_1.TipoIdent,
                tipo_impuesto_entity_1.TipoImpuesto
            ])
        ],
        controllers: [terceros_controller_1.TercerosController, maestros_controller_1.MaestrosController],
        providers: [terceros_service_1.TercerosService, maestros_service_1.MaestrosService],
        exports: [terceros_service_1.TercerosService]
    }),
    __metadata("design:paramtypes", [])
], TercerosModule);
//# sourceMappingURL=terceros.module.js.map