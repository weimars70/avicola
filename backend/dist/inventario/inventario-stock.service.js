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
exports.InventarioStockService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const inventario_entity_1 = require("./entities/inventario.entity");
let InventarioStockService = class InventarioStockService {
    constructor(inventarioRepository) {
        this.inventarioRepository = inventarioRepository;
    }
    async create(createInventarioDto) {
        const inventario = this.inventarioRepository.create(createInventarioDto);
        return await this.inventarioRepository.save(inventario);
    }
    async findAll() {
        return await this.inventarioRepository.find({
            relations: ['tipoHuevo'],
            order: { tipoHuevo: { nombre: 'ASC' } },
        });
    }
    async findByTipoHuevo(tipoHuevoId) {
        return await this.inventarioRepository.findOne({
            where: { tipoHuevoId },
            relations: ['tipoHuevo'],
        });
    }
    async findOne(id) {
        const inventario = await this.inventarioRepository.findOne({
            where: { id },
            relations: ['tipoHuevo'],
        });
        if (!inventario) {
            throw new common_1.NotFoundException(`Inventario con ID ${id} no encontrado`);
        }
        return inventario;
    }
    async update(id, updateInventarioDto) {
        const inventario = await this.findOne(id);
        Object.assign(inventario, updateInventarioDto);
        return await this.inventarioRepository.save(inventario);
    }
    async remove(id) {
        const inventario = await this.findOne(id);
        await this.inventarioRepository.remove(inventario);
    }
    async actualizarInventario(tipoHuevoId, unidadesAgregar) {
        const inventarioExistente = await this.findByTipoHuevo(tipoHuevoId);
        if (inventarioExistente) {
            inventarioExistente.unidades += unidadesAgregar;
            return await this.inventarioRepository.save(inventarioExistente);
        }
        else {
            const nuevoInventario = this.inventarioRepository.create({
                tipoHuevoId,
                unidades: unidadesAgregar,
            });
            return await this.inventarioRepository.save(nuevoInventario);
        }
    }
    async reducirInventario(tipoHuevoId, unidadesReducir) {
        const inventarioExistente = await this.findByTipoHuevo(tipoHuevoId);
        if (!inventarioExistente) {
            throw new common_1.NotFoundException(`No hay inventario para el tipo de huevo ${tipoHuevoId}`);
        }
        if (inventarioExistente.unidades < unidadesReducir) {
            throw new Error(`No hay suficientes unidades en inventario. Disponible: ${inventarioExistente.unidades}, Solicitado: ${unidadesReducir}`);
        }
        inventarioExistente.unidades -= unidadesReducir;
        return await this.inventarioRepository.save(inventarioExistente);
    }
    async aumentarStock(tipoHuevoId, unidadesAumentar) {
        return this.actualizarInventario(tipoHuevoId, unidadesAumentar);
    }
    async reducirStock(tipoHuevoId, unidadesReducir) {
        return this.reducirInventario(tipoHuevoId, unidadesReducir);
    }
    async getVistaInventario() {
        const inventarios = await this.inventarioRepository.find({
            relations: ['tipoHuevo'],
            order: { unidades: 'DESC' }
        });
        return inventarios.map(item => ({
            id: item.id,
            unidades: item.unidades,
            valorTotal: item.unidades * item.tipoHuevo.valorUnidad,
            tipoHuevo: {
                id: item.tipoHuevo.id,
                nombre: item.tipoHuevo.nombre,
                valorUnidad: item.tipoHuevo.valorUnidad
            }
        }));
    }
};
exports.InventarioStockService = InventarioStockService;
exports.InventarioStockService = InventarioStockService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(inventario_entity_1.Inventario)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InventarioStockService);
//# sourceMappingURL=inventario-stock.service.js.map