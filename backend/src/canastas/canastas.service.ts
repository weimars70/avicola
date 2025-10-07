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

  async findAllByEmpresa(id_empresa: number): Promise<Canasta[]> {
    return await this.canastasRepository.find({
      where: { activo: true, id_empresa },
      relations: ['tipoHuevo'],
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string, id_empresa: number): Promise<Canasta> {
    const canasta = await this.canastasRepository.findOne({
      where: { id, activo: true, id_empresa },
      relations: ['tipoHuevo'],
    });

    if (!canasta) {
      throw new NotFoundException(`Canasta con ID ${id} no encontrada`);
    }

    return canasta;
  }

  async update(id: string, id_empresa: number, updateCanastaDto: UpdateCanastaDto): Promise<Canasta> {
    // Validar que el tipo de huevo existe si se está actualizando
    if (updateCanastaDto.tipoHuevoId) {
      await this.tiposHuevoService.findOne(updateCanastaDto.tipoHuevoId);
    }
    // Asegurar que no se actualicen registros de otra empresa
    const existing = await this.findOne(id, id_empresa);
    await this.canastasRepository.update({ id, id_empresa }, updateCanastaDto);
    return this.findOne(id, id_empresa);
  }

  async remove(id: string, id_empresa: number): Promise<void> {
    const canasta = await this.findOne(id, id_empresa);
    canasta.activo = false;
    canasta.updatedAt = new Date();
    await this.canastasRepository.save(canasta);
  }

  async findAllIncludingInactive(id_empresa: number): Promise<Canasta[]> {
    return await this.canastasRepository.find({
      where: { id_empresa },
      relations: ['tipoHuevo'],
      order: { nombre: 'ASC' },
    });
  }
}