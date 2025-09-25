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
exports.CategoriasGastosSeed = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const categoria_gasto_entity_1 = require("../entities/categoria-gasto.entity");
let CategoriasGastosSeed = class CategoriasGastosSeed {
    constructor(categoriasRepository) {
        this.categoriasRepository = categoriasRepository;
    }
    async seed() {
        const categorias = [
            {
                id: 1,
                nombre: 'Inversión Inicial',
                descripcion: 'Gastos de inversión inicial y equipamiento',
                color: '#4ECDC4'
            },
            {
                id: 2,
                nombre: 'Comida',
                descripcion: 'Gastos relacionados con alimentación de las aves',
                color: '#FF6B6B'
            },
            {
                id: 3,
                nombre: 'Vacunas',
                descripcion: 'Gastos en vacunas y medicamentos',
                color: '#45B7D1'
            },
            {
                id: 4,
                nombre: 'Mantenimiento',
                descripcion: 'Gastos de mantenimiento de instalaciones',
                color: '#96CEB4'
            },
            {
                id: 5,
                nombre: 'Servicios',
                descripcion: 'Gastos en servicios básicos (luz, agua, etc.)',
                color: '#FFEAA7'
            },
            {
                id: 6,
                nombre: 'Otros',
                descripcion: 'Otros gastos diversos',
                color: '#DDA0DD'
            }
        ];
        for (const categoriaData of categorias) {
            const existingCategoria = await this.categoriasRepository.findOne({
                where: { id: categoriaData.id }
            });
            if (!existingCategoria) {
                const categoria = this.categoriasRepository.create(categoriaData);
                await this.categoriasRepository.save(categoria);
                console.log(`Categoría creada: ${categoria.nombre} (ID: ${categoria.id})`);
            }
            else {
                console.log(`Categoría ya existe: ${categoriaData.nombre} (ID: ${categoriaData.id})`);
            }
        }
    }
};
exports.CategoriasGastosSeed = CategoriasGastosSeed;
exports.CategoriasGastosSeed = CategoriasGastosSeed = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(categoria_gasto_entity_1.CategoriaGasto)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriasGastosSeed);
//# sourceMappingURL=categorias-gastos.seed.js.map