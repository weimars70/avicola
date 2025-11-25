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
exports.TiposHuevoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tipo_huevo_entity_1 = require("./entities/tipo-huevo.entity");
let TiposHuevoService = class TiposHuevoService {
    constructor(tiposHuevoRepository) {
        this.tiposHuevoRepository = tiposHuevoRepository;
    }
    async create(createTipoHuevoDto) {
        const tipoHuevo = this.tiposHuevoRepository.create(createTipoHuevoDto);
        return await this.tiposHuevoRepository.save(tipoHuevo);
    }
    async findAll(id_empresa) {
        return await this.tiposHuevoRepository.find({
            where: { activo: true, id_empresa },
            order: { nombre: 'ASC' },
        });
    }
    async findOne(id, id_empresa) {
        const whereCondition = { id, activo: true };
        if (id_empresa !== undefined) {
            whereCondition.id_empresa = id_empresa;
        }
        const tipoHuevo = await this.tiposHuevoRepository.findOne({
            where: whereCondition,
        });
        if (!tipoHuevo) {
            throw new common_1.NotFoundException(`Tipo de huevo con ID ${id} no encontrado${id_empresa ? ' para la empresa indicada' : ''}`);
        }
        return tipoHuevo;
    }
    async update(id, updateTipoHuevoDto) {
        const tipoHuevo = await this.findOne(id);
        Object.assign(tipoHuevo, updateTipoHuevoDto);
        tipoHuevo.updatedAt = new Date();
        return await this.tiposHuevoRepository.save(tipoHuevo);
    }
    async remove(id) {
        const tipoHuevo = await this.findOne(id);
        tipoHuevo.activo = false;
        tipoHuevo.updatedAt = new Date();
        await this.tiposHuevoRepository.save(tipoHuevo);
    }
    async findAllIncludingInactive() {
        return await this.tiposHuevoRepository.find({
            order: { nombre: 'ASC' },
        });
    }
};
exports.TiposHuevoService = TiposHuevoService;
exports.TiposHuevoService = TiposHuevoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tipo_huevo_entity_1.TipoHuevo)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TiposHuevoService);
//# sourceMappingURL=tipos-huevo.service.js.map