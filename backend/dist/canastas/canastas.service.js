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
exports.CanastasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const canasta_entity_1 = require("./entities/canasta.entity");
const tipos_huevo_service_1 = require("../tipos-huevo/tipos-huevo.service");
let CanastasService = class CanastasService {
    constructor(canastasRepository, tiposHuevoService) {
        this.canastasRepository = canastasRepository;
        this.tiposHuevoService = tiposHuevoService;
    }
    async create(createCanastaDto) {
        await this.tiposHuevoService.findOne(createCanastaDto.tipoHuevoId);
        const canasta = this.canastasRepository.create(createCanastaDto);
        return this.canastasRepository.save(canasta);
    }
    async findAllByEmpresa(id_empresa) {
        return await this.canastasRepository.find({
            where: { activo: true, id_empresa },
            relations: ['tipoHuevo'],
            order: { nombre: 'ASC' },
        });
    }
    async findOne(id, id_empresa) {
        const canasta = await this.canastasRepository.findOne({
            where: { id, activo: true, id_empresa },
            relations: ['tipoHuevo'],
        });
        if (!canasta) {
            throw new common_1.NotFoundException(`Canasta con ID ${id} no encontrada`);
        }
        return canasta;
    }
    async update(id, id_empresa, updateCanastaDto) {
        if (updateCanastaDto.tipoHuevoId) {
            await this.tiposHuevoService.findOne(updateCanastaDto.tipoHuevoId);
        }
        const existing = await this.findOne(id, id_empresa);
        await this.canastasRepository.update({ id, id_empresa }, updateCanastaDto);
        return this.findOne(id, id_empresa);
    }
    async remove(id, id_empresa) {
        const canasta = await this.findOne(id, id_empresa);
        canasta.activo = false;
        canasta.updatedAt = new Date();
        await this.canastasRepository.save(canasta);
    }
    async findAllIncludingInactive(id_empresa) {
        return await this.canastasRepository.find({
            where: { id_empresa },
            relations: ['tipoHuevo'],
            order: { nombre: 'ASC' },
        });
    }
};
exports.CanastasService = CanastasService;
exports.CanastasService = CanastasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(canasta_entity_1.Canasta)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        tipos_huevo_service_1.TiposHuevoService])
], CanastasService);
//# sourceMappingURL=canastas.service.js.map