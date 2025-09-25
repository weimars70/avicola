"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanastasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const canasta_entity_1 = require("./entities/canasta.entity");
const canastas_controller_1 = require("./canastas.controller");
const canastas_service_1 = require("./canastas.service");
const tipos_huevo_module_1 = require("../tipos-huevo/tipos-huevo.module");
let CanastasModule = class CanastasModule {
};
exports.CanastasModule = CanastasModule;
exports.CanastasModule = CanastasModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([canasta_entity_1.Canasta]),
            tipos_huevo_module_1.TiposHuevoModule
        ],
        controllers: [canastas_controller_1.CanastasController],
        providers: [canastas_service_1.CanastasService],
        exports: [canastas_service_1.CanastasService],
    })
], CanastasModule);
//# sourceMappingURL=canastas.module.js.map