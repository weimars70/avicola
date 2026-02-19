import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoHuevo } from './entities/tipo-huevo.entity';
import { CreateTipoHuevoDto } from './dto/create-tipo-huevo.dto';
import { UpdateTipoHuevoDto } from './dto/update-tipo-huevo.dto';

@Injectable()
export class TiposHuevoService {
  constructor(
    @InjectRepository(TipoHuevo)
    private tiposHuevoRepository: Repository<TipoHuevo>,
  ) { }

  async create(createTipoHuevoDto: CreateTipoHuevoDto): Promise<TipoHuevo> {
    const tipoHuevo = this.tiposHuevoRepository.create(createTipoHuevoDto);
    return await this.tiposHuevoRepository.save(tipoHuevo);
  }

  async findAll(id_empresa: number): Promise<TipoHuevo[]> {
    return await this.tiposHuevoRepository.find({
      where: { activo: true, id_empresa },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string, id_empresa?: number): Promise<TipoHuevo> {
    const whereCondition: any = { id, activo: true };

    // Si se proporciona id_empresa, añadirlo a la condición de búsqueda
    if (id_empresa !== undefined) {
      whereCondition.id_empresa = id_empresa;
    }

    const tipoHuevo = await this.tiposHuevoRepository.findOne({
      where: whereCondition,
    });

    if (!tipoHuevo) {
      throw new NotFoundException(`Tipo de huevo con ID ${id} no encontrado${id_empresa ? ' para la empresa indicada' : ''}`);
    }

    return tipoHuevo;
  }

  async update(id: string, updateTipoHuevoDto: UpdateTipoHuevoDto): Promise<TipoHuevo> {
    const tipoHuevo = await this.findOne(id);

    Object.assign(tipoHuevo, updateTipoHuevoDto);
    tipoHuevo.updatedAt = new Date();

    return await this.tiposHuevoRepository.save(tipoHuevo);
  }

  async remove(id: string): Promise<void> {
    const tipoHuevo = await this.findOne(id);

    tipoHuevo.activo = false;
    tipoHuevo.updatedAt = new Date();

    await this.tiposHuevoRepository.save(tipoHuevo);
  }

  async findAllIncludingInactive(id_empresa: number): Promise<TipoHuevo[]> {
    return await this.tiposHuevoRepository.find({
      where: { id_empresa },
      order: { nombre: 'ASC' },
    });
  }
}