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
exports.CategoriasGastosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const categoria_gasto_entity_1 = require("./entities/categoria-gasto.entity");
let CategoriasGastosService = class CategoriasGastosService {
    constructor(categoriasRepository) {
        this.categoriasRepository = categoriasRepository;
    }
    async create(createCategoriaGastoDto) {
        const existingCategoria = await this.categoriasRepository.findOne({
            where: { nombre: createCategoriaGastoDto.nombre, activo: true }
        });
        if (existingCategoria) {
            throw new common_1.ConflictException(`Ya existe una categoría con el nombre '${createCategoriaGastoDto.nombre}'`);
        }
        const categoria = this.categoriasRepository.create(createCategoriaGastoDto);
        return this.categoriasRepository.save(categoria);
    }
    async findAll() {
        return await this.categoriasRepository.find({
            where: { activo: true },
            order: { nombre: 'ASC' },
        });
    }
    async findAllIncludingInactive() {
        return await this.categoriasRepository.find({
            order: { nombre: 'ASC' },
        });
    }
    async findOne(id) {
        const categoria = await this.categoriasRepository.findOne({
            where: { id: parseInt(id), activo: true },
            relations: ['gastos'],
        });
        if (!categoria) {
            throw new common_1.NotFoundException(`Categoría con ID ${id} no encontrada`);
        }
        return categoria;
    }
    async update(id, updateCategoriaGastoDto) {
        const categoria = await this.findOne(id);
        if (updateCategoriaGastoDto.nombre && updateCategoriaGastoDto.nombre !== categoria.nombre) {
            const existingCategoria = await this.categoriasRepository.findOne({
                where: { nombre: updateCategoriaGastoDto.nombre, activo: true }
            });
            if (existingCategoria) {
                throw new common_1.ConflictException(`Ya existe una categoría con el nombre '${updateCategoriaGastoDto.nombre}'`);
            }
        }
        await this.categoriasRepository.update(id, updateCategoriaGastoDto);
        return this.findOne(id);
    }
    async remove(id) {
        const categoria = await this.findOne(id);
        await this.categoriasRepository.update(id, { activo: false });
    }
    async seedCategorias() {
        const categorias = [
            {
                nombre: 'Comida',
                descripcion: 'Alimentos para las aves',
                color: '#FF6B6B'
            },
            {
                nombre: 'Inversión Inicial',
                descripcion: 'Gastos de inversión inicial del proyecto',
                color: '#4ECDC4'
            },
            {
                nombre: 'Vacunas',
                descripcion: 'Vacunas y medicamentos para las aves',
                color: '#45B7D1'
            },
            {
                nombre: 'Mantenimiento',
                descripcion: 'Mantenimiento de instalaciones y equipos',
                color: '#96CEB4'
            },
            {
                nombre: 'Servicios Públicos',
                descripcion: 'Electricidad, agua, gas, etc.',
                color: '#FFEAA7'
            },
            {
                nombre: 'Transporte',
                descripcion: 'Gastos de transporte y combustible',
                color: '#DDA0DD'
            },
            {
                nombre: 'Mano de Obra',
                descripcion: 'Salarios y beneficios del personal',
                color: '#98D8C8'
            },
            {
                nombre: 'Otros',
                descripcion: 'Otros gastos diversos',
                color: '#F7DC6F'
            },
            {
                nombre: 'Consumo Propio',
                descripcion: 'Huevos consumidos por los propietarios del gallinero',
                color: '#E74C3C'
            }
        ];
        const categoriasCreadas = [];
        for (const categoriaData of categorias) {
            const existingCategoria = await this.categoriasRepository.findOne({
                where: { nombre: categoriaData.nombre }
            });
            if (!existingCategoria) {
                const categoria = this.categoriasRepository.create(categoriaData);
                const savedCategoria = await this.categoriasRepository.save(categoria);
                categoriasCreadas.push(savedCategoria);
            }
        }
        return {
            message: `Se crearon ${categoriasCreadas.length} categorías de gastos`,
            categorias: categoriasCreadas
        };
    }
};
exports.CategoriasGastosService = CategoriasGastosService;
exports.CategoriasGastosService = CategoriasGastosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(categoria_gasto_entity_1.CategoriaGasto)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriasGastosService);
//# sourceMappingURL=categorias-gastos.service.js.map