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
  ) {}

  async create(createTipoHuevoDto: CreateTipoHuevoDto): Promise<TipoHuevo> {
    const tipoHuevo = this.tiposHuevoRepository.create(createTipoHuevoDto);
    return await this.tiposHuevoRepository.save(tipoHuevo);
  }

  async findAll(): Promise<TipoHuevo[]> {
    return await this.tiposHuevoRepository.find({
      where: { activo: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<TipoHuevo> {
    const tipoHuevo = await this.tiposHuevoRepository.findOne({
      where: { id, activo: true },
    });

    if (!tipoHuevo) {
      throw new NotFoundException(`Tipo de huevo con ID ${id} no encontrado`);
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

  async findAllIncludingInactive(): Promise<TipoHuevo[]> {
    return await this.tiposHuevoRepository.find({
      order: { nombre: 'ASC' },
    });
  }
}