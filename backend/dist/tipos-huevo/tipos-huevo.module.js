"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiposHuevoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tipo_huevo_entity_1 = require("./entities/tipo-huevo.entity");
const tipos_huevo_controller_1 = require("./tipos-huevo.controller");
const tipos_huevo_service_1 = require("./tipos-huevo.service");
let TiposHuevoModule = class TiposHuevoModule {
};
exports.TiposHuevoModule = TiposHuevoModule;
exports.TiposHuevoModule = TiposHuevoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([tipo_huevo_entity_1.TipoHuevo])],
        controllers: [tipos_huevo_controller_1.TiposHuevoController],
        providers: [tipos_huevo_service_1.TiposHuevoService],
        exports: [tipos_huevo_service_1.TiposHuevoService, typeorm_1.TypeOrmModule.forFeature([tipo_huevo_entity_1.TipoHuevo])],
    })
], TiposHuevoModule);
//# sourceMappingURL=tipos-huevo.module.js.map