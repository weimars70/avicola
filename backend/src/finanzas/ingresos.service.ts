import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Ingreso } from './entities/ingreso.entity';
import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { UpdateIngresoDto } from './dto/update-ingreso.dto';
import { SalidasService } from '../salidas/salidas.service';

@Injectable()
export class IngresosService {
  constructor(
    @InjectRepository(Ingreso)
    private ingresosRepository: Repository<Ingreso>,
    @Inject(forwardRef(() => SalidasService))
    private salidasService: SalidasService,
  ) {}

  async create(createIngresoDto: CreateIngresoDto): Promise<Ingreso> {
    const ingreso = this.ingresosRepository.create(createIngresoDto);
    return await this.ingresosRepository.save(ingreso);
  }

  async findAll(): Promise<Ingreso[]> {
    return await this.ingresosRepository.find({
      where: { activo: true },
      relations: ['salida'],
      order: { fecha: 'DESC' },
    });
  }

  async findAllIncludingInactive(): Promise<Ingreso[]> {
    return await this.ingresosRepository.find({
      relations: ['salida'],
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Ingreso> {
    const ingreso = await this.ingresosRepository.findOne({
      where: { id, activo: true },
      relations: ['salida'],
    });

    if (!ingreso) {
      throw new NotFoundException(`Ingreso con ID ${id} no encontrado`);
    }

    return ingreso;
  }

  async findByDateRange(fechaInicio: string, fechaFin: string): Promise<Ingreso[]> {
    return await this.ingresosRepository.find({
      where: {
        fecha: Between(fechaInicio, fechaFin),
        activo: true,
      },
      relations: ['salida'],
      order: { fecha: 'DESC' },
    });
  }

  async findByTipo(tipo: string): Promise<Ingreso[]> {
    return await this.ingresosRepository.find({
      where: { tipo, activo: true },
      relations: ['salida'],
      order: { fecha: 'DESC' },
    });
  }

  async update(id: string, updateIngresoDto: UpdateIngresoDto): Promise<Ingreso> {
    const ingreso = await this.findOne(id);
    Object.assign(ingreso, updateIngresoDto);
    return await this.ingresosRepository.save(ingreso);
  }

  async remove(id: string): Promise<void> {
    const ingreso = await this.findOne(id);
    ingreso.activo = false;
    await this.ingresosRepository.save(ingreso);
  }

  async getTotalIngresos(id_empresa: number): Promise<number> {
    const result = await this.ingresosRepository
      .createQueryBuilder('ingreso')
      .select('SUM(ingreso.monto)', 'total')
      .where('ingreso.activo = :activo AND ingreso.id_empresa = :id_empresa', { 
        activo: true,
        id_empresa 
      })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  async getTotalIngresosByDateRange(fechaInicio: string, fechaFin: string, id_empresa: number): Promise<number> {
    const result = await this.ingresosRepository
      .createQueryBuilder('ingreso')
      .select('SUM(ingreso.monto)', 'total')
      .where('ingreso.activo = :activo AND ingreso.id_empresa = :id_empresa', { 
        activo: true,
        id_empresa 
      })
      .andWhere('ingreso.fecha BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin,
      })
      .getRawOne();

    return parseFloat(result.total) || 0;
  }

  async getTotalIngresosByTipo(id_empresa: number): Promise<any[]> {
    const result = await this.ingresosRepository
      .createQueryBuilder('ingreso')
      .select('ingreso.tipo', 'tipo')
      .addSelect('SUM(ingreso.monto)', 'total')
      .addSelect('COUNT(ingreso.id)', 'cantidad')
      .where('ingreso.activo = :activo AND ingreso.id_empresa = :id_empresa', { 
        activo: true,
        id_empresa 
      })
      .groupBy('ingreso.tipo')
      .getRawMany();

    return result.map(item => ({
      tipo: item.tipo,
      total: parseFloat(item.total) || 0,
      cantidad: parseInt(item.cantidad) || 0,
    }));
  }

  // Método para sincronizar ingresos desde salidas
  async syncIngresosFromSalidas(id_empresa: number): Promise<Ingreso[]> {
    const salidas = await this.salidasService.findAll(id_empresa);
    const ingresosCreados: Ingreso[] = [];

    for (const salida of salidas) {
      // Verificar si ya existe un ingreso para esta salida
      const ingresoExistente = await this.ingresosRepository.findOne({
        where: { salidaId: salida.id },
      });

      if (!ingresoExistente) {
        // Calcular el monto basado en la salida usando el valor de la canasta
        const monto = salida.unidades * (salida.canasta?.valorCanasta || 0);
        
        const nuevoIngreso = await this.create({
          monto,
          fecha: salida.createdAt.toISOString().split('T')[0], // Convertir Date a string formato YYYY-MM-DD
          descripcion: `Venta de ${salida.unidades} unidades de ${salida.tipoHuevo?.nombre || 'huevos'}`,
          observaciones: `Generado automáticamente desde salida ${salida.id}`,
          tipo: 'venta',
          salidaId: salida.id,
        });

        ingresosCreados.push(nuevoIngreso);
      }
    }

    return ingresosCreados;
  }

  async getIngresosDiarios(fechaInicio: string, fechaFin: string, id_empresa?: number): Promise<any[]> {
    const queryBuilder = this.ingresosRepository
      .createQueryBuilder('ingreso')
      .select('DATE(ingreso.fecha)', 'fecha')
      .addSelect('SUM(ingreso.monto)', 'total')
      .where('ingreso.fecha BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
      .andWhere('ingreso.activo = :activo', { activo: true });
    
    if (id_empresa) {
      queryBuilder.andWhere('ingreso.id_empresa = :id_empresa', { id_empresa });
    }
    
    const result = await queryBuilder
      .groupBy('DATE(ingreso.fecha)')
      .orderBy('fecha', 'ASC')
      .getRawMany();

    return result;
  }
}