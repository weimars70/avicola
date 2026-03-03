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
    async create(createCanastaDto, id_empresa, id_usuario_inserta) {
        console.log('🛠️ [SERVICE] Create starting...');
        const empresaId = Number(id_empresa);
        console.log('🔍 Validating egg type:', createCanastaDto.tipoHuevoId, 'for empresa:', empresaId);
        try {
            await this.tiposHuevoService.findOne(createCanastaDto.tipoHuevoId, empresaId);
            console.log('✅ Egg type validated');
        }
        catch (error) {
            console.error('❌ Egg type validation failed:', error.message);
            throw error;
        }
        const canasta = this.canastasRepository.create(Object.assign(Object.assign({}, createCanastaDto), { id_empresa: empresaId, empresa_id: empresaId, usuario: 'weimars70@gmail.com', id_usuario_inserta }));
        console.log('💾 Saving canasta to DB...');
        const saved = await this.canastasRepository.save(canasta);
        console.log('🎉 Canasta saved successfully with ID:', saved.id);
        return saved;
    }
    async findAllByEmpresa(id_empresa) {
        const empresaId = Number(id_empresa);
        return await this.canastasRepository.find({
            where: { activo: true, id_empresa: empresaId },
            relations: ['tipoHuevo'],
            order: { nombre: 'ASC' },
        });
    }
    async findOne(id, id_empresa, includeInactive = false) {
        const empresaId = Number(id_empresa);
        const whereCondition = { id, id_empresa: empresaId };
        if (!includeInactive) {
            whereCondition.activo = true;
        }
        const canasta = await this.canastasRepository.findOne({
            where: whereCondition,
            relations: ['tipoHuevo'],
        });
        if (!canasta) {
            throw new common_1.NotFoundException(`Canasta con ID ${id} no encontrada`);
        }
        return canasta;
    }
    async update(id, id_empresa, updateCanastaDto, id_usuario_actualiza) {
        const empresaId = Number(id_empresa);
        if (updateCanastaDto.tipoHuevoId) {
            await this.tiposHuevoService.findOne(updateCanastaDto.tipoHuevoId, empresaId);
        }
        await this.findOne(id, empresaId, true);
        await this.canastasRepository.update({ id, id_empresa: empresaId }, Object.assign(Object.assign({}, updateCanastaDto), { id_usuario_actualiza }));
        return this.findOne(id, empresaId, true);
    }
    async remove(id, id_empresa) {
        const empresaId = Number(id_empresa);
        const canasta = await this.findOne(id, empresaId);
        canasta.activo = false;
        canasta.updatedAt = new Date();
        await this.canastasRepository.save(canasta);
    }
    async findAllIncludingInactive(id_empresa) {
        const empresaId = Number(id_empresa);
        return await this.canastasRepository.find({
            where: { id_empresa: empresaId },
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