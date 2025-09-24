import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaGasto } from './entities/categoria-gasto.entity';
import { CreateCategoriaGastoDto } from './dto/create-categoria-gasto.dto';
import { UpdateCategoriaGastoDto } from './dto/update-categoria-gasto.dto';
import { CategoriasGastosSeed } from './seeds/categorias-gastos.seed';

@Injectable()
export class CategoriasGastosService {
  constructor(
    @InjectRepository(CategoriaGasto)
    private categoriasRepository: Repository<CategoriaGasto>,
  ) {}

  async create(createCategoriaGastoDto: CreateCategoriaGastoDto): Promise<CategoriaGasto> {
    // Verificar que no existe una categoría con el mismo nombre
    const existingCategoria = await this.categoriasRepository.findOne({
      where: { nombre: createCategoriaGastoDto.nombre, activo: true }
    });

    if (existingCategoria) {
      throw new ConflictException(`Ya existe una categoría con el nombre '${createCategoriaGastoDto.nombre}'`);
    }

    const categoria = this.categoriasRepository.create(createCategoriaGastoDto);
    return this.categoriasRepository.save(categoria);
  }

  async findAll(): Promise<CategoriaGasto[]> {
    return await this.categoriasRepository.find({
      where: { activo: true },
      order: { nombre: 'ASC' },
    });
  }

  async findAllIncludingInactive(): Promise<CategoriaGasto[]> {
    return await this.categoriasRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CategoriaGasto> {
    const categoria = await this.categoriasRepository.findOne({
      where: { id: parseInt(id), activo: true },
      relations: ['gastos'],
    });

    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return categoria;
  }

  async update(id: string, updateCategoriaGastoDto: UpdateCategoriaGastoDto): Promise<CategoriaGasto> {
    // Verificar que la categoría existe
    const categoria = await this.findOne(id);

    // Si se está actualizando el nombre, verificar que no exista otra categoría con ese nombre
    if (updateCategoriaGastoDto.nombre && updateCategoriaGastoDto.nombre !== categoria.nombre) {
      const existingCategoria = await this.categoriasRepository.findOne({
        where: { nombre: updateCategoriaGastoDto.nombre, activo: true }
      });

      if (existingCategoria) {
        throw new ConflictException(`Ya existe una categoría con el nombre '${updateCategoriaGastoDto.nombre}'`);
      }
    }

    await this.categoriasRepository.update(id, updateCategoriaGastoDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const categoria = await this.findOne(id);
    
    // Soft delete - marcar como inactivo
    await this.categoriasRepository.update(id, { activo: false });
  }

  async seedCategorias(): Promise<{ message: string; categorias: CategoriaGasto[] }> {
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

    const categoriasCreadas: CategoriaGasto[] = [];

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
}