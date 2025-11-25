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
exports.GastosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const gasto_entity_1 = require("./entities/gasto.entity");
const categorias_gastos_service_1 = require("./categorias-gastos.service");
const inventario_stock_service_1 = require("../inventario/inventario-stock.service");
const tipos_huevo_service_1 = require("../tipos-huevo/tipos-huevo.service");
let GastosService = class GastosService {
    constructor(gastosRepository, categoriasGastosService, inventarioStockService, tiposHuevoService) {
        this.gastosRepository = gastosRepository;
        this.categoriasGastosService = categoriasGastosService;
        this.inventarioStockService = inventarioStockService;
        this.tiposHuevoService = tiposHuevoService;
    }
    async create(createGastoDto) {
        await this.categoriasGastosService.findOne(createGastoDto.categoriaId.toString());
        const gasto = this.gastosRepository.create(Object.assign(Object.assign({}, createGastoDto), { fecha: new Date(createGastoDto.fecha) }));
        return await this.gastosRepository.save(gasto);
    }
    async createConsumoPropio(createConsumoPropioDto) {
        var _a;
        const categorias = await this.categoriasGastosService.findAll();
        const categoriaConsumoPropio = categorias.find(cat => cat.nombre === 'Consumo Propio');
        if (!categoriaConsumoPropio) {
            throw new common_1.NotFoundException('Categoría "Consumo Propio" no encontrada');
        }
        let montoTotal = 0;
        let descripcionDetallada = createConsumoPropioDto.descripcion + ' - ';
        for (const huevoConsumido of createConsumoPropioDto.huevosConsumidos) {
            const tipoHuevo = await this.tiposHuevoService.findOne(huevoConsumido.tipoHuevoId, createConsumoPropioDto.id_empresa);
            await this.inventarioStockService.reducirStock(huevoConsumido.tipoHuevoId, huevoConsumido.unidades, createConsumoPropioDto.id_empresa);
            const valorHuevos = tipoHuevo.valorUnidad * huevoConsumido.unidades;
            montoTotal += valorHuevos;
            descripcionDetallada += `${huevoConsumido.unidades} ${tipoHuevo.nombre} ($${tipoHuevo.valorUnidad} c/u), `;
        }
        descripcionDetallada = descripcionDetallada.slice(0, -2);
        const gasto = this.gastosRepository.create({
            descripcion: descripcionDetallada,
            monto: montoTotal,
            fecha: new Date(createConsumoPropioDto.fecha),
            observaciones: createConsumoPropioDto.observaciones,
            categoriaId: categoriaConsumoPropio.id,
            activo: (_a = createConsumoPropioDto.activo) !== null && _a !== void 0 ? _a : true,
            id_empresa: createConsumoPropioDto.id_empresa,
            id_usuario_inserta: createConsumoPropioDto.id_usuario_inserta
        });
        return await this.gastosRepository.save(gasto);
    }
    async findAll(id_empresa) {
        return await this.gastosRepository.find({
            where: { activo: true, id_empresa },
            relations: ['categoria'],
            order: { fecha: 'DESC' },
        });
    }
    async findAllIncludingInactive() {
        return await this.gastosRepository.find({
            relations: ['categoria'],
            order: { fecha: 'DESC' },
        });
    }
    async findByDateRange(fechaInicio, fechaFin) {
        return await this.gastosRepository.find({
            where: {
                activo: true,
                fecha: (0, typeorm_2.Between)(new Date(fechaInicio), new Date(fechaFin))
            },
            relations: ['categoria'],
            order: { fecha: 'DESC' },
        });
    }
    async findByCategoria(categoriaId) {
        return await this.gastosRepository.find({
            where: { categoriaId, activo: true },
            relations: ['categoria'],
            order: { fecha: 'DESC' },
        });
    }
    async findOne(id) {
        const gasto = await this.gastosRepository.findOne({
            where: { id, activo: true },
            relations: ['categoria'],
        });
        if (!gasto) {
            throw new common_1.NotFoundException(`Gasto con ID ${id} no encontrado`);
        }
        return gasto;
    }
    async update(id, updateGastoDto) {
        const gasto = await this.findOne(id);
        if (updateGastoDto.categoriaId) {
            await this.categoriasGastosService.findOne(updateGastoDto.categoriaId.toString());
        }
        const updateData = Object.assign({}, updateGastoDto);
        if (updateData.categoriaId) {
            updateData.categoriaId = Number(updateData.categoriaId);
        }
        Object.assign(gasto, updateData);
        return await this.gastosRepository.save(gasto);
    }
    async remove(id) {
        await this.findOne(id);
        await this.gastosRepository.update(id, { activo: false });
    }
    async getTotalGastosByCategoria(id_empresa) {
        return await this.gastosRepository
            .createQueryBuilder('gasto')
            .leftJoin('gasto.categoria', 'categoria')
            .select('categoria.nombre', 'categoria')
            .addSelect('categoria.color', 'color')
            .addSelect('SUM(gasto.monto)', 'total')
            .where('gasto.activo = :activo AND gasto.id_empresa = :id_empresa', {
            activo: true,
            id_empresa
        })
            .groupBy('categoria.id')
            .getRawMany();
    }
    async getTotalGastos(id_empresa) {
        const result = await this.gastosRepository
            .createQueryBuilder('gasto')
            .select('SUM(gasto.monto)', 'total')
            .where('gasto.activo = :activo AND gasto.id_empresa = :id_empresa', {
            activo: true,
            id_empresa
        })
            .getRawOne();
        return parseFloat(result.total) || 0;
    }
    async getTotalGastosExcluyendoInversion(id_empresa) {
        const result = await this.gastosRepository
            .createQueryBuilder('gasto')
            .leftJoin('gasto.categoria', 'categoria')
            .select('SUM(gasto.monto)', 'total')
            .where('gasto.activo = :activo AND gasto.id_empresa = :id_empresa', {
            activo: true,
            id_empresa
        })
            .andWhere('categoria.nombre != :inversionInicial', { inversionInicial: 'Inversión Inicial' })
            .getRawOne();
        return parseFloat(result.total) || 0;
    }
    async getTotalInversionInicial(id_empresa) {
        const result = await this.gastosRepository
            .createQueryBuilder('gasto')
            .leftJoin('gasto.categoria', 'categoria')
            .select('SUM(gasto.monto)', 'total')
            .where('gasto.activo = :activo AND gasto.id_empresa = :id_empresa', {
            activo: true,
            id_empresa
        })
            .andWhere('categoria.nombre = :inversionInicial', { inversionInicial: 'Inversión Inicial' })
            .getRawOne();
        return parseFloat(result.total) || 0;
    }
    async getTotalGastosByDateRange(fechaInicio, fechaFin, id_empresa) {
        const result = await this.gastosRepository
            .createQueryBuilder('gasto')
            .select('SUM(gasto.monto)', 'total')
            .where('gasto.activo = :activo AND gasto.id_empresa = :id_empresa', {
            activo: true,
            id_empresa
        })
            .andWhere('gasto.fecha BETWEEN :fechaInicio AND :fechaFin', {
            fechaInicio: new Date(fechaInicio),
            fechaFin: new Date(fechaFin)
        })
            .getRawOne();
        return parseFloat(result.total) || 0;
    }
    async getTotalGastosByDateRangeExcluyendoInversion(fechaInicio, fechaFin, id_empresa) {
        const result = await this.gastosRepository
            .createQueryBuilder('gasto')
            .leftJoin('gasto.categoria', 'categoria')
            .select('SUM(gasto.monto)', 'total')
            .where('gasto.activo = :activo AND gasto.id_empresa = :id_empresa', {
            activo: true,
            id_empresa
        })
            .andWhere('categoria.nombre != :inversionInicial', { inversionInicial: 'Inversión Inicial' })
            .andWhere('gasto.fecha BETWEEN :fechaInicio AND :fechaFin', {
            fechaInicio: new Date(fechaInicio),
            fechaFin: new Date(fechaFin)
        })
            .getRawOne();
        return parseFloat(result.total) || 0;
    }
    async getGastosDiarios(fechaInicio, fechaFin, id_empresa) {
        const queryBuilder = this.gastosRepository
            .createQueryBuilder('gasto')
            .select('DATE(gasto.fecha)', 'fecha')
            .addSelect('SUM(gasto.monto)', 'total')
            .where('gasto.fecha BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
            .andWhere('gasto.activo = :activo', { activo: true });
        if (id_empresa) {
            queryBuilder.andWhere('gasto.id_empresa = :id_empresa', { id_empresa });
        }
        const result = await queryBuilder
            .groupBy('DATE(gasto.fecha)')
            .orderBy('fecha', 'ASC')
            .getRawMany();
        return result;
    }
    async createOrUpdateInversionInicial(montoTotal, fechaInicio, metaRecuperacion, id_empresa, id_usuario_inserta) {
        let categoria;
        try {
            const categorias = await this.categoriasGastosService.findAll();
            categoria = categorias.find(cat => cat.nombre === 'Inversión Inicial');
            if (!categoria) {
                categoria = await this.categoriasGastosService.create({
                    nombre: 'Inversión Inicial',
                    descripcion: 'Inversión inicial del proyecto avícola',
                    color: '#FF6B35'
                });
            }
        }
        catch (error) {
            throw new Error('Error al obtener o crear la categoría de Inversión Inicial');
        }
        const inversionExistente = await this.gastosRepository
            .createQueryBuilder('gasto')
            .leftJoin('gasto.categoria', 'categoria')
            .where('categoria.nombre = :nombre', { nombre: 'Inversión Inicial' })
            .andWhere('gasto.activo = :activo', { activo: true })
            .andWhere('gasto.categoriaId = :categoriaId', { categoriaId: categoria.id })
            .andWhere('gasto.id_empresa = :id_empresa', { id_empresa })
            .getOne();
        if (inversionExistente) {
            inversionExistente.monto = montoTotal;
            inversionExistente.fecha = new Date(fechaInicio);
            inversionExistente.descripcion = `Inversión Inicial del Proyecto${metaRecuperacion ? ` (Meta: ${metaRecuperacion} meses)` : ''}`;
            inversionExistente.observaciones = metaRecuperacion ? `Meta de recuperación: ${metaRecuperacion} meses` : undefined;
            return await this.gastosRepository.save(inversionExistente);
        }
        else {
            const nuevaInversion = this.gastosRepository.create({
                descripcion: `Inversión Inicial del Proyecto${metaRecuperacion ? ` (Meta: ${metaRecuperacion} meses)` : ''}`,
                monto: montoTotal,
                fecha: new Date(fechaInicio),
                categoriaId: categoria.id,
                observaciones: metaRecuperacion ? `Meta de recuperación: ${metaRecuperacion} meses` : undefined,
                activo: true,
                id_empresa,
                id_usuario_inserta
            });
            return await this.gastosRepository.save(nuevaInversion);
        }
    }
};
exports.GastosService = GastosService;
exports.GastosService = GastosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(gasto_entity_1.Gasto)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        categorias_gastos_service_1.CategoriasGastosService,
        inventario_stock_service_1.InventarioStockService,
        tipos_huevo_service_1.TiposHuevoService])
], GastosService);
//# sourceMappingURL=gastos.service.js.map