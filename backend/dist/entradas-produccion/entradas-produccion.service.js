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
exports.EntradasProduccionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entrada_produccion_entity_1 = require("./entities/entrada-produccion.entity");
const galpon_entity_1 = require("../galpones/entities/galpon.entity");
const tipo_huevo_entity_1 = require("../tipos-huevo/entities/tipo-huevo.entity");
const inventario_stock_service_1 = require("../inventario/inventario-stock.service");
let EntradasProduccionService = class EntradasProduccionService {
    constructor(entradasProduccionRepository, galponesRepository, tiposHuevoRepository, inventarioStockService) {
        this.entradasProduccionRepository = entradasProduccionRepository;
        this.galponesRepository = galponesRepository;
        this.tiposHuevoRepository = tiposHuevoRepository;
        this.inventarioStockService = inventarioStockService;
    }
    async create(createEntradaProduccionDto) {
        const galpon = await this.galponesRepository.findOne({ where: { id: createEntradaProduccionDto.galponId } });
        if (!galpon) {
            throw new common_1.NotFoundException(`Galpón con ID ${createEntradaProduccionDto.galponId} no encontrado`);
        }
        const tipoHuevo = await this.tiposHuevoRepository.findOne({ where: { id: createEntradaProduccionDto.tipoHuevoId } });
        if (!tipoHuevo) {
            throw new common_1.NotFoundException(`Tipo de huevo con ID ${createEntradaProduccionDto.tipoHuevoId} no encontrado`);
        }
        const entradaProduccion = this.entradasProduccionRepository.create(createEntradaProduccionDto);
        const savedEntrada = await this.entradasProduccionRepository.save(entradaProduccion);
        await this.inventarioStockService.actualizarInventario(createEntradaProduccionDto.tipoHuevoId, createEntradaProduccionDto.unidades);
        return savedEntrada;
    }
    async createMasivas(createEntradasMasivasDto) {
        const galpon = await this.galponesRepository.findOne({ where: { id: createEntradasMasivasDto.galponId } });
        if (!galpon) {
            throw new common_1.NotFoundException(`Galpón con ID ${createEntradasMasivasDto.galponId} no encontrado`);
        }
        const tipoHuevoIds = createEntradasMasivasDto.entradas.map(entrada => entrada.tipoHuevoId);
        const tiposHuevo = await this.tiposHuevoRepository.findByIds(tipoHuevoIds);
        if (tiposHuevo.length !== tipoHuevoIds.length) {
            throw new common_1.BadRequestException('Uno o más tipos de huevo no existen');
        }
        const entradasValidas = createEntradasMasivasDto.entradas.filter(entrada => entrada.unidades > 0);
        if (entradasValidas.length === 0) {
            throw new common_1.BadRequestException('Debe especificar al menos una entrada con unidades mayor a 0');
        }
        const entradasProduccion = entradasValidas.map(entrada => this.entradasProduccionRepository.create({
            galponId: createEntradasMasivasDto.galponId,
            fecha: createEntradasMasivasDto.fecha,
            tipoHuevoId: entrada.tipoHuevoId,
            unidades: entrada.unidades
        }));
        const savedEntradas = await this.entradasProduccionRepository.save(entradasProduccion);
        for (const entrada of savedEntradas) {
            await this.inventarioStockService.actualizarInventario(entrada.tipoHuevoId, entrada.unidades);
        }
        return savedEntradas;
    }
    async findAll(id_empresa) {
        return await this.entradasProduccionRepository.find({
            where: { id_empresa },
            relations: ['galpon', 'tipoHuevo'],
            order: { fecha: 'DESC' },
        });
    }
    async findByDateRange(fechaInicio, fechaFin) {
        return this.entradasProduccionRepository.find({
            where: {
                fecha: (0, typeorm_2.Between)(new Date(fechaInicio), new Date(fechaFin))
            },
            relations: ['galpon', 'tipoHuevo'],
            order: { fecha: 'DESC' }
        });
    }
    async findOne(id) {
        const entradaProduccion = await this.entradasProduccionRepository.findOne({
            where: { id },
            relations: ['galpon', 'tipoHuevo']
        });
        if (!entradaProduccion) {
            throw new common_1.NotFoundException(`Entrada de producción con ID ${id} no encontrada`);
        }
        return entradaProduccion;
    }
    async update(id, updateEntradaProduccionDto) {
        const entradaProduccion = await this.findOne(id);
        if (updateEntradaProduccionDto.galponId) {
            const galpon = await this.galponesRepository.findOne({ where: { id: updateEntradaProduccionDto.galponId } });
            if (!galpon) {
                throw new common_1.NotFoundException(`Galpón con ID ${updateEntradaProduccionDto.galponId} no encontrado`);
            }
        }
        if (updateEntradaProduccionDto.tipoHuevoId) {
            const tipoHuevo = await this.tiposHuevoRepository.findOne({ where: { id: updateEntradaProduccionDto.tipoHuevoId } });
            if (!tipoHuevo) {
                throw new common_1.NotFoundException(`Tipo de huevo con ID ${updateEntradaProduccionDto.tipoHuevoId} no encontrado`);
            }
        }
        Object.assign(entradaProduccion, updateEntradaProduccionDto);
        return this.entradasProduccionRepository.save(entradaProduccion);
    }
    async remove(id) {
        const entradaProduccion = await this.findOne(id);
        await this.entradasProduccionRepository.remove(entradaProduccion);
    }
    async getProduccionDiaria(fechaInicio, fechaFin) {
        const result = await this.entradasProduccionRepository
            .createQueryBuilder('entrada')
            .select('DATE(entrada.fecha)', 'fecha')
            .addSelect('SUM(entrada.unidades)', 'total')
            .where('entrada.fecha BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
            .groupBy('DATE(entrada.fecha)')
            .orderBy('fecha', 'ASC')
            .getRawMany();
        return result;
    }
};
exports.EntradasProduccionService = EntradasProduccionService;
exports.EntradasProduccionService = EntradasProduccionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entrada_produccion_entity_1.EntradaProduccion)),
    __param(1, (0, typeorm_1.InjectRepository)(galpon_entity_1.Galpon)),
    __param(2, (0, typeorm_1.InjectRepository)(tipo_huevo_entity_1.TipoHuevo)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        inventario_stock_service_1.InventarioStockService])
], EntradasProduccionService);
//# sourceMappingURL=entradas-produccion.service.js.map