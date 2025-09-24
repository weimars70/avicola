import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Gasto } from './entities/gasto.entity';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { CreateConsumoPropioDto } from './dto/create-consumo-propio.dto';
import { CategoriasGastosService } from './categorias-gastos.service';
import { InventarioStockService } from '../inventario/inventario-stock.service';
import { TiposHuevoService } from '../tipos-huevo/tipos-huevo.service';

@Injectable()
export class GastosService {
  constructor(
    @InjectRepository(Gasto)
    private gastosRepository: Repository<Gasto>,
    private categoriasGastosService: CategoriasGastosService,
    private inventarioStockService: InventarioStockService,
    private tiposHuevoService: TiposHuevoService,
  ) {}

  async create(createGastoDto: CreateGastoDto): Promise<Gasto> {
    // Verificar que la categoría existe
    await this.categoriasGastosService.findOne(createGastoDto.categoriaId.toString());
    
    const gasto = this.gastosRepository.create({
      ...createGastoDto,
      fecha: new Date(createGastoDto.fecha)
    });
    return await this.gastosRepository.save(gasto);
  }

  async createConsumoPropio(createConsumoPropioDto: CreateConsumoPropioDto): Promise<Gasto> {
    // Buscar la categoría "Consumo Propio"
    const categorias = await this.categoriasGastosService.findAll();
    const categoriaConsumoPropio = categorias.find(cat => cat.nombre === 'Consumo Propio');
    
    if (!categoriaConsumoPropio) {
      throw new NotFoundException('Categoría "Consumo Propio" no encontrada');
    }

    // Calcular el monto total basado en los huevos consumidos
    let montoTotal = 0;
    let descripcionDetallada = createConsumoPropioDto.descripcion + ' - ';
    
    for (const huevoConsumido of createConsumoPropioDto.huevosConsumidos) {
      // Verificar que el tipo de huevo existe
      const tipoHuevo = await this.tiposHuevoService.findOne(huevoConsumido.tipoHuevoId);
      
      // Reducir del inventario
      await this.inventarioStockService.reducirStock(huevoConsumido.tipoHuevoId, huevoConsumido.unidades);
      
      // Calcular el valor (precio por unidad * cantidad)
      const valorHuevos = tipoHuevo.valorUnidad * huevoConsumido.unidades;
      montoTotal += valorHuevos;
      
      // Agregar a la descripción
      descripcionDetallada += `${huevoConsumido.unidades} ${tipoHuevo.nombre} ($${tipoHuevo.valorUnidad} c/u), `;
    }
    
    // Remover la última coma y espacio
    descripcionDetallada = descripcionDetallada.slice(0, -2);

    // Crear el gasto
    const gasto = this.gastosRepository.create({
      descripcion: descripcionDetallada,
      monto: montoTotal,
      fecha: new Date(createConsumoPropioDto.fecha),
      observaciones: createConsumoPropioDto.observaciones,
      categoriaId: categoriaConsumoPropio.id,
      activo: createConsumoPropioDto.activo ?? true,
    });
    
    return await this.gastosRepository.save(gasto);
  }

  async findAll(): Promise<Gasto[]> {
    return await this.gastosRepository.find({
      where: { activo: true },
      relations: ['categoria'],
      order: { fecha: 'DESC' },
    });
  }

  async findAllIncludingInactive(): Promise<Gasto[]> {
    return await this.gastosRepository.find({
      relations: ['categoria'],
      order: { fecha: 'DESC' },
    });
  }

  async findByDateRange(fechaInicio: string, fechaFin: string): Promise<Gasto[]> {
    return await this.gastosRepository.find({
      where: {
        activo: true,
        fecha: Between(new Date(fechaInicio), new Date(fechaFin))
      },
      relations: ['categoria'],
      order: { fecha: 'DESC' },
    });
  }

  async findByCategoria(categoriaId: number): Promise<Gasto[]> {
    return await this.gastosRepository.find({
      where: { categoriaId, activo: true },
      relations: ['categoria'],
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Gasto> {
    const gasto = await this.gastosRepository.findOne({
      where: { id, activo: true },
      relations: ['categoria'],
    });

    if (!gasto) {
      throw new NotFoundException(`Gasto con ID ${id} no encontrado`);
    }

    return gasto;
  }

  async update(id: string, updateGastoDto: UpdateGastoDto): Promise<Gasto> {
    // Verificar que el gasto existe
    await this.findOne(id);

    // Verificar que la categoría existe si se está actualizando
    if (updateGastoDto.categoriaId) {
      await this.categoriasGastosService.findOne(updateGastoDto.categoriaId.toString());
    }

    const updateData: any = { ...updateGastoDto };
    
    // Convertir categoriaId a número si está presente
    if (updateData.categoriaId) {
      updateData.categoriaId = Number(updateData.categoriaId);
    }
    
    await this.gastosRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    
    // Soft delete - marcar como inactivo
    await this.gastosRepository.update(id, { activo: false });
  }

  async getTotalGastosByCategoria(): Promise<any[]> {
    return await this.gastosRepository
      .createQueryBuilder('gasto')
      .leftJoin('gasto.categoria', 'categoria')
      .select('categoria.nombre', 'categoria')
      .addSelect('categoria.color', 'color')
      .addSelect('SUM(gasto.monto)', 'total')
      .where('gasto.activo = :activo', { activo: true })
      .groupBy('categoria.id')
      .getRawMany();
  }

  async getTotalGastos(): Promise<number> {
    const result = await this.gastosRepository
      .createQueryBuilder('gasto')
      .select('SUM(gasto.monto)', 'total')
      .where('gasto.activo = :activo', { activo: true })
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }

  async getTotalGastosExcluyendoInversion(): Promise<number> {
    const result = await this.gastosRepository
      .createQueryBuilder('gasto')
      .leftJoin('gasto.categoria', 'categoria')
      .select('SUM(gasto.monto)', 'total')
      .where('gasto.activo = :activo', { activo: true })
      .andWhere('categoria.nombre != :inversionInicial', { inversionInicial: 'Inversión Inicial' })
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }

  async getTotalInversionInicial(): Promise<number> {
    const result = await this.gastosRepository
      .createQueryBuilder('gasto')
      .leftJoin('gasto.categoria', 'categoria')
      .select('SUM(gasto.monto)', 'total')
      .where('gasto.activo = :activo', { activo: true })
      .andWhere('categoria.nombre = :inversionInicial', { inversionInicial: 'Inversión Inicial' })
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }

  async getTotalGastosByDateRange(fechaInicio: string, fechaFin: string): Promise<number> {
    const result = await this.gastosRepository
      .createQueryBuilder('gasto')
      .select('SUM(gasto.monto)', 'total')
      .where('gasto.activo = :activo', { activo: true })
      .andWhere('gasto.fecha BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin)
      })
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }

  async getTotalGastosByDateRangeExcluyendoInversion(fechaInicio: string, fechaFin: string): Promise<number> {
    const result = await this.gastosRepository
      .createQueryBuilder('gasto')
      .leftJoin('gasto.categoria', 'categoria')
      .select('SUM(gasto.monto)', 'total')
      .where('gasto.activo = :activo', { activo: true })
      .andWhere('categoria.nombre != :inversionInicial', { inversionInicial: 'Inversión Inicial' })
      .andWhere('gasto.fecha BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin)
      })
      .getRawOne();
    
    return parseFloat(result.total) || 0;
  }

  async getGastosDiarios(fechaInicio: string, fechaFin: string): Promise<any[]> {
    const result = await this.gastosRepository
      .createQueryBuilder('gasto')
      .select('DATE(gasto.fecha)', 'fecha')
      .addSelect('SUM(gasto.monto)', 'total')
      .where('gasto.fecha BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
      .andWhere('gasto.activo = :activo', { activo: true })
      .groupBy('DATE(gasto.fecha)')
      .orderBy('fecha', 'ASC')
      .getRawMany();

    return result;
  }

  async createOrUpdateInversionInicial(
    montoTotal: number,
    fechaInicio: string,
    metaRecuperacion?: number
  ): Promise<Gasto> {
    // Buscar o crear la categoría 'Inversión Inicial'
    let categoria;
    try {
      const categorias = await this.categoriasGastosService.findAll();
      categoria = categorias.find(cat => cat.nombre === 'Inversión Inicial');
      
      if (!categoria) {
        categoria = await this.categoriasGastosService.create({
          nombre: 'Inversión Inicial',
          descripcion: 'Inversión inicial del proyecto avícola',
          color: '#FF6B35'
        });
      }
    } catch (error) {
      throw new Error('Error al obtener o crear la categoría de Inversión Inicial');
    }

    // Buscar si ya existe un gasto de inversión inicial
    const inversionExistente = await this.gastosRepository
      .createQueryBuilder('gasto')
      .leftJoin('gasto.categoria', 'categoria')
      .where('categoria.nombre = :nombre', { nombre: 'Inversión Inicial' })
      .andWhere('gasto.activo = :activo', { activo: true })
      .andWhere('gasto.categoriaId = :categoriaId', { categoriaId: categoria.id })
      .getOne();

    if (inversionExistente) {
      // Actualizar la inversión existente
      inversionExistente.monto = montoTotal;
      inversionExistente.fecha = new Date(fechaInicio);
      inversionExistente.descripcion = `Inversión Inicial del Proyecto${metaRecuperacion ? ` (Meta: ${metaRecuperacion} meses)` : ''}`;
      inversionExistente.observaciones = metaRecuperacion ? `Meta de recuperación: ${metaRecuperacion} meses` : undefined;
      
      return await this.gastosRepository.save(inversionExistente);
    } else {
      // Crear nueva inversión inicial
      const nuevaInversion = this.gastosRepository.create({
        descripcion: `Inversión Inicial del Proyecto${metaRecuperacion ? ` (Meta: ${metaRecuperacion} meses)` : ''}`,
        monto: montoTotal,
        fecha: new Date(fechaInicio),
        categoriaId: categoria.id,
        observaciones: metaRecuperacion ? `Meta de recuperación: ${metaRecuperacion} meses` : undefined,
        activo: true
      });
      
      return await this.gastosRepository.save(nuevaInversion);
    }
  }
}