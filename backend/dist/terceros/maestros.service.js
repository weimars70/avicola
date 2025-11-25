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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaestrosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ciudad_entity_1 = require("./entities/ciudad.entity");
const estrato_entity_1 = require("./entities/estrato.entity");
const tipo_regimen_entity_1 = require("./entities/tipo-regimen.entity");
const tipo_ident_entity_1 = require("./entities/tipo-ident.entity");
const tipo_impuesto_entity_1 = require("./entities/tipo-impuesto.entity");
let MaestrosService = class MaestrosService {
    constructor(ciudadRepository, estratoRepository, tipoRegimenRepository, tipoIdentRepository, tipoImpuestoRepository) {
        this.ciudadRepository = ciudadRepository;
        this.estratoRepository = estratoRepository;
        this.tipoRegimenRepository = tipoRegimenRepository;
        this.tipoIdentRepository = tipoIdentRepository;
        this.tipoImpuestoRepository = tipoImpuestoRepository;
    }
    async findAllCiudades(activo) {
        const query = this.ciudadRepository.createQueryBuilder('ciudad');
        if (activo !== undefined) {
            query.where('ciudad.activo = :activo', { activo });
        }
        return query.orderBy('ciudad.nombre', 'ASC').getMany();
    }
    async findAllEstratos(activo, idEmpresa) {
        const defaultEstratos = [
            { codigo: 1, nombre: 'Estrato 1', idEmpresa: idEmpresa || null },
            { codigo: 2, nombre: 'Estrato 2', idEmpresa: idEmpresa || null },
            { codigo: 3, nombre: 'Estrato 3', idEmpresa: idEmpresa || null },
            { codigo: 4, nombre: 'Estrato 4', idEmpresa: idEmpresa || null },
            { codigo: 5, nombre: 'Estrato 5', idEmpresa: idEmpresa || null },
            { codigo: 6, nombre: 'Estrato 6', idEmpresa: idEmpresa || null }
        ];
        console.log('Devolviendo estratos predeterminados sin consultar la base de datos');
        return defaultEstratos;
    }
    async findAllTiposRegimen(activo) {
        const query = this.tipoRegimenRepository.createQueryBuilder('tipoRegimen');
        if (activo !== undefined) {
            query.where('tipoRegimen.activo = :activo', { activo });
        }
        return query.orderBy('tipoRegimen.nombre', 'ASC').getMany();
    }
    async findAllTiposIdent(activo) {
        const query = this.tipoIdentRepository.createQueryBuilder('tipoIdent');
        if (activo !== undefined) {
            query.where('tipoIdent.activo = :activo', { activo });
        }
        return query.orderBy('tipoIdent.nombre', 'ASC').getMany();
    }
    async findAllTiposImpuesto(activo) {
        const query = this.tipoImpuestoRepository.createQueryBuilder('tipoImpuesto');
        if (activo !== undefined) {
            query.where('tipoImpuesto.activo = :activo', { activo });
        }
        return query.orderBy('tipoImpuesto.nombre', 'ASC').getMany();
    }
};
exports.MaestrosService = MaestrosService;
exports.MaestrosService = MaestrosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ciudad_entity_1.Ciudad)),
    __param(1, (0, typeorm_1.InjectRepository)(estrato_entity_1.Estrato)),
    __param(2, (0, typeorm_1.InjectRepository)(tipo_regimen_entity_1.TipoRegimen)),
    __param(3, (0, typeorm_1.InjectRepository)(tipo_ident_entity_1.TipoIdent)),
    __param(4, (0, typeorm_1.InjectRepository)(tipo_impuesto_entity_1.TipoImpuesto)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MaestrosService);
//# sourceMappingURL=maestros.service.js.map