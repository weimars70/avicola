import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Canasta } from './entities/canasta.entity';
import { CreateCanastaDto } from './dto/create-canasta.dto';
import { UpdateCanastaDto } from './dto/update-canasta.dto';
import { TiposHuevoService } from '../tipos-huevo/tipos-huevo.service';

@Injectable()
export class CanastasService {
  constructor(
    @InjectRepository(Canasta)
    private canastasRepository: Repository<Canasta>,
    private tiposHuevoService: TiposHuevoService,
  ) {}

  async create(createCanastaDto: CreateCanastaDto): Promise<Canasta> {
    // Validar que el tipo de huevo existe
    await this.tiposHuevoService.findOne(createCanastaDto.tipoHuevoId);
    
    const canasta = this.canastasRepository.create(createCanastaDto);
    return this.canastasRepository.save(canasta);
  }

  async findAll(): Promise<Canasta[]> {
    return await this.canastasRepository.find({
      where: { activo: true },
      relations: ['tipoHuevo'],
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Canasta> {
    const canasta = await this.canastasRepository.findOne({
      where: { id, activo: true },
      relations: ['tipoHuevo'],
    });

    if (!canasta) {
      throw new NotFoundException(`Canasta con ID ${id} no encontrada`);
    }

    return canasta;
  }

  async update(id: string, updateCanastaDto: UpdateCanastaDto): Promise<Canasta> {
    // Validar que el tipo de huevo existe si se está actualizando
    if (updateCanastaDto.tipoHuevoId) {
      await this.tiposHuevoService.findOne(updateCanastaDto.tipoHuevoId);
    }
    
    await this.canastasRepository.update(id, updateCanastaDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const canasta = await this.findOne(id);
    
    canasta.activo = false;
    canasta.updatedAt = new Date();
    
    await this.canastasRepository.save(canasta);
  }

  async findAllIncludingInactive(): Promise<Canasta[]> {
    return await this.canastasRepository.find({
      relations: ['tipoHuevo'],
      order: { nombre: 'ASC' },
    });
  }
}