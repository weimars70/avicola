import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaGasto } from '../entities/categoria-gasto.entity';

@Injectable()
export class CategoriasGastosSeed {
  constructor(
    @InjectRepository(CategoriaGasto)
    private categoriasRepository: Repository<CategoriaGasto>,
  ) {}

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
      } else {
        console.log(`Categoría ya existe: ${categoriaData.nombre} (ID: ${categoriaData.id})`);
      }
    }
  }
}