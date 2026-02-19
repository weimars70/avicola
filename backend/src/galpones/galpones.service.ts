import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Galpon } from './entities/galpon.entity';
import { CreateGalponDto } from './dto/create-galpon.dto';
import { UpdateGalponDto } from './dto/update-galpon.dto';

@Injectable()
export class GalponesService {
  private readonly logger = new Logger(GalponesService.name);

  constructor(
    @InjectRepository(Galpon)
    private galponesRepository: Repository<Galpon>,
  ) { }

  async create(createGalponDto: CreateGalponDto): Promise<Galpon> {
    this.logger.log('=== SERVICIO: INICIO CREACIÓN GALPÓN ===');
    this.logger.log('DTO recibido en servicio:', JSON.stringify(createGalponDto));

    try {
      this.logger.log('Creando entidad Galpon...');
      const galpon = this.galponesRepository.create(createGalponDto);
      this.logger.log('Entidad creada:', JSON.stringify(galpon));

      this.logger.log('Guardando en base de datos...');
      const galponGuardado = await this.galponesRepository.save(galpon);
      this.logger.log('Galpón guardado en BD:', JSON.stringify(galponGuardado));
      this.logger.log('=== SERVICIO: FIN CREACIÓN GALPÓN (ÉXITO) ===');

      return galponGuardado;
    } catch (error) {
      this.logger.error('Error en servicio al crear galpón:', error.message);
      this.logger.error('Stack trace del servicio:', error.stack);
      this.logger.log('=== SERVICIO: FIN CREACIÓN GALPÓN (ERROR) ===');
      throw error;
    }
  }

  async findAll(id_empresa: number): Promise<Galpon[]> {
    return await this.galponesRepository.find({
      where: { id_empresa },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string, id_empresa: number): Promise<Galpon> {
    const galpon = await this.galponesRepository.findOne({
      where: { id, id_empresa, activo: true },
    });

    if (!galpon) {
      throw new NotFoundException(`Galpón con ID ${id} no encontrado`);
    }

    return galpon;
  }

  async update(id: string, updateGalponDto: UpdateGalponDto, id_empresa: number): Promise<Galpon> {
    this.logger.log('=== SERVICIO: INICIO ACTUALIZACIÓN GALPÓN ===');
    this.logger.log('ID recibido:', id);
    this.logger.log('DTO de actualización recibido:', JSON.stringify(updateGalponDto));

    try {
      this.logger.log('Buscando galpón existente...');
      const galpon = await this.findOne(id, id_empresa);
      this.logger.log('Galpón encontrado:', JSON.stringify(galpon));

      this.logger.log('Aplicando cambios con Object.assign...');
      Object.assign(galpon, updateGalponDto);
      galpon.updatedAt = new Date();
      this.logger.log('Galpón después de Object.assign:', JSON.stringify(galpon));

      this.logger.log('Guardando cambios en base de datos...');
      const galponActualizado = await this.galponesRepository.save(galpon);
      this.logger.log('Galpón actualizado en BD:', JSON.stringify(galponActualizado));
      this.logger.log('=== SERVICIO: FIN ACTUALIZACIÓN GALPÓN (ÉXITO) ===');

      return galponActualizado;
    } catch (error) {
      this.logger.error('Error en servicio al actualizar galpón:', error.message);
      this.logger.error('Stack trace del servicio:', error.stack);
      this.logger.log('=== SERVICIO: FIN ACTUALIZACIÓN GALPÓN (ERROR) ===');
      throw error;
    }
  }

  async remove(id: string, id_empresa: number): Promise<void> {
    const galpon = await this.findOne(id, id_empresa);

    galpon.activo = false;
    galpon.updatedAt = new Date();

    await this.galponesRepository.save(galpon);
  }

  async reactivate(id: string, id_empresa: number): Promise<void> {
    const galpon = await this.galponesRepository.findOne({
      where: { id, id_empresa },
    });

    if (!galpon) {
      throw new NotFoundException(`Galpón con ID ${id} no encontrado`);
    }

    galpon.activo = true;
    galpon.updatedAt = new Date();

    await this.galponesRepository.save(galpon);
  }

  async findAllIncludingInactive(id_empresa: number): Promise<Galpon[]> {
    return await this.galponesRepository.find({
      where: { id_empresa },
      order: { nombre: 'ASC' },
    });
  }
}