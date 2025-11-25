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
exports.TercerosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tercero_entity_1 = require("./entities/tercero.entity");
let TercerosService = class TercerosService {
    constructor(terceroRepository) {
        this.terceroRepository = terceroRepository;
    }
    async create(idEmpresa, createTerceroDto) {
        console.log('Service - crear tercero para empresa:', idEmpresa);
        console.log('Service - datos:', createTerceroDto);
        try {
            const existe = await this.terceroRepository.findOne({
                where: {
                    identificacion: createTerceroDto.identificacion,
                    idEmpresa: idEmpresa
                }
            });
            if (existe) {
                throw new common_1.BadRequestException('Ya existe un tercero con esta identificación en esta empresa');
            }
            const tercero = this.terceroRepository.create(Object.assign(Object.assign({}, createTerceroDto), { idEmpresa: idEmpresa }));
            console.log('Service - tercero a guardar:', tercero);
            const savedTercero = await this.terceroRepository.save(tercero);
            console.log('Tercero guardado:', savedTercero);
            return savedTercero;
        }
        catch (error) {
            console.error('Service - error al crear:', error);
            if (error.message && error.message.includes('estratos')) {
                throw new common_1.BadRequestException('Error al guardar el tercero: el estrato se guarda directamente como código sin necesidad de tabla adicional');
            }
            throw error;
        }
    }
    async findAll(idEmpresa) {
        return await this.terceroRepository.find({
            where: { idEmpresa: idEmpresa },
            order: { codigo: 'DESC' }
        });
    }
    async findOne(codigo, idEmpresa) {
        const tercero = await this.terceroRepository.findOne({
            where: {
                codigo: codigo,
                idEmpresa: idEmpresa
            }
        });
        if (!tercero) {
            throw new common_1.NotFoundException(`Tercero con código ${codigo} no encontrado`);
        }
        return tercero;
    }
    async update(codigo, updateTerceroDto, idEmpresa) {
        const tercero = await this.findOne(codigo, idEmpresa);
        if (updateTerceroDto.identificacion !== tercero.identificacion) {
            const existe = await this.terceroRepository.findOne({
                where: {
                    identificacion: updateTerceroDto.identificacion,
                    idEmpresa: idEmpresa
                }
            });
            if (existe) {
                throw new common_1.BadRequestException('Ya existe un tercero con esta identificación en esta empresa');
            }
        }
        Object.assign(tercero, updateTerceroDto);
        return await this.terceroRepository.save(tercero);
    }
    async remove(codigo, idEmpresa) {
        const tercero = await this.findOne(codigo, idEmpresa);
        await this.terceroRepository.remove(tercero);
    }
    async buscarPorIdentificacion(identificacion, idEmpresa) {
        return await this.terceroRepository
            .createQueryBuilder('tercero')
            .where('tercero.identificacion LIKE :identificacion AND tercero.id_empresa = :idEmpresa', {
            identificacion: `%${identificacion}%`,
            idEmpresa: idEmpresa
        })
            .getMany();
    }
    async buscarPorNombre(nombre, idEmpresa) {
        return await this.terceroRepository
            .createQueryBuilder('tercero')
            .where('tercero.nombre LIKE :nombre AND tercero.id_empresa = :idEmpresa', {
            nombre: `%${nombre}%`,
            idEmpresa: idEmpresa
        })
            .getMany();
    }
    async findActivos(idEmpresa) {
        return await this.terceroRepository.find({
            where: {
                activo: true,
                idEmpresa: idEmpresa
            },
            order: { nombre: 'ASC' }
        });
    }
    async findClientes(idEmpresa) {
        return await this.terceroRepository.find({
            where: {
                cliente: true,
                activo: true,
                idEmpresa: idEmpresa
            },
            order: { nombre: 'ASC' }
        });
    }
    async findProveedores(idEmpresa) {
        return await this.terceroRepository.find({
            where: {
                proveedor: true,
                activo: true,
                idEmpresa: idEmpresa
            },
            order: { nombre: 'ASC' }
        });
    }
};
exports.TercerosService = TercerosService;
exports.TercerosService = TercerosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tercero_entity_1.Tercero)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TercerosService);
//# sourceMappingURL=terceros.service.js.map