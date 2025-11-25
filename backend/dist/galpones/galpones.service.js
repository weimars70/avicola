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
var GalponesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalponesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const galpon_entity_1 = require("./entities/galpon.entity");
let GalponesService = GalponesService_1 = class GalponesService {
    constructor(galponesRepository) {
        this.galponesRepository = galponesRepository;
        this.logger = new common_1.Logger(GalponesService_1.name);
    }
    async create(createGalponDto) {
        this.logger.log('=== SERVICIO: INICIO CREACIÓN GALPÓN ===');
        this.logger.log('DTO recibido en servicio:', JSON.stringify(createGalponDto));
        try {
            this.logger.log('Creando entidad Galpon...');
            const galpon = this.galponesRepository.create(createGalponDto);
            this.logger.log('Entidad creada:', JSON.stringify(galpon));
            this.logger.log('Guardando en base de datos...');
            const galponGuardado = await this.galponesRepository.save(galpon);
            this.logger.log('Galpón guardado en BD:', JSON.stringify(galponGuardado));
            this.logger.log('=== SERVICIO: FIN CREACIÓN GALPÓN (ÉXITO) ===');
            return galponGuardado;
        }
        catch (error) {
            this.logger.error('Error en servicio al crear galpón:', error.message);
            this.logger.error('Stack trace del servicio:', error.stack);
            this.logger.log('=== SERVICIO: FIN CREACIÓN GALPÓN (ERROR) ===');
            throw error;
        }
    }
    async findAll(id_empresa) {
        return await this.galponesRepository.find({
            where: { id_empresa },
            order: { nombre: 'ASC' },
        });
    }
    async findOne(id) {
        const galpon = await this.galponesRepository.findOne({
            where: { id, activo: true },
        });
        if (!galpon) {
            throw new common_1.NotFoundException(`Galpón con ID ${id} no encontrado`);
        }
        return galpon;
    }
    async update(id, updateGalponDto) {
        this.logger.log('=== SERVICIO: INICIO ACTUALIZACIÓN GALPÓN ===');
        this.logger.log('ID recibido:', id);
        this.logger.log('DTO de actualización recibido:', JSON.stringify(updateGalponDto));
        try {
            this.logger.log('Buscando galpón existente...');
            const galpon = await this.findOne(id);
            this.logger.log('Galpón encontrado:', JSON.stringify(galpon));
            this.logger.log('Aplicando cambios con Object.assign...');
            Object.assign(galpon, updateGalponDto);
            galpon.updatedAt = new Date();
            this.logger.log('Galpón después de Object.assign:', JSON.stringify(galpon));
            this.logger.log('Guardando cambios en base de datos...');
            const galponActualizado = await this.galponesRepository.save(galpon);
            this.logger.log('Galpón actualizado en BD:', JSON.stringify(galponActualizado));
            this.logger.log('=== SERVICIO: FIN ACTUALIZACIÓN GALPÓN (ÉXITO) ===');
            return galponActualizado;
        }
        catch (error) {
            this.logger.error('Error en servicio al actualizar galpón:', error.message);
            this.logger.error('Stack trace del servicio:', error.stack);
            this.logger.log('=== SERVICIO: FIN ACTUALIZACIÓN GALPÓN (ERROR) ===');
            throw error;
        }
    }
    async remove(id) {
        const galpon = await this.findOne(id);
        galpon.activo = false;
        galpon.updatedAt = new Date();
        await this.galponesRepository.save(galpon);
    }
    async reactivate(id) {
        const galpon = await this.galponesRepository.findOne({
            where: { id },
        });
        if (!galpon) {
            throw new common_1.NotFoundException(`Galpón con ID ${id} no encontrado`);
        }
        galpon.activo = true;
        galpon.updatedAt = new Date();
        await this.galponesRepository.save(galpon);
    }
    async findAllIncludingInactive() {
        return await this.galponesRepository.find({
            order: { nombre: 'ASC' },
        });
    }
};
exports.GalponesService = GalponesService;
exports.GalponesService = GalponesService = GalponesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(galpon_entity_1.Galpon)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GalponesService);
//# sourceMappingURL=galpones.service.js.map