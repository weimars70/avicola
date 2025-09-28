import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSalidaDto } from './dto/create-salida.dto';
import { UpdateSalidaDto } from './dto/update-salida.dto';
import { Salida } from './entities/salida.entity';
import { TiposHuevoService } from '../tipos-huevo/tipos-huevo.service';
import { CanastasService } from '../canastas/canastas.service';
import { InventarioStockService } from '../inventario/inventario-stock.service';
import { IngresosService } from '../finanzas/ingresos.service';

@Injectable()
export class SalidasService {
  constructor(
    @InjectRepository(Salida)
    private salidasRepository: Repository<Salida>,
    private tiposHuevoService: TiposHuevoService,
    private canastasService: CanastasService,
    private inventarioStockService: InventarioStockService,
    @Inject(forwardRef(() => IngresosService))
    private ingresosService: IngresosService,
  ) {}

  async create(createSalidaDto: CreateSalidaDto): Promise<Salida> {
    // Validar que el tipo de huevo existe
    const tipoHuevo = await this.tiposHuevoService.findOne(createSalidaDto.tipoHuevoId);
    
    let canasta = null;
    let unidadesTotales = createSalidaDto.unidades;
    
    // Validar que la canasta existe solo si se proporciona
    if (createSalidaDto.canastaId) {
      canasta = await this.canastasService.findOne(createSalidaDto.canastaId);
      // Calcular unidades totales (canastas * unidades por canasta)
      unidadesTotales = createSalidaDto.unidades * canasta.unidadesPorCanasta;
    }
    
    // Reducir del inventario antes de crear la salida
    await this.inventarioStockService.reducirInventario(
      createSalidaDto.tipoHuevoId,
      unidadesTotales
    );
    
    // Asegurar que siempre haya una fecha definida
    const fechaFinal = createSalidaDto.fecha || new Date().toISOString().split('T')[0];
    
    const salida = this.salidasRepository.create({
      ...createSalidaDto,
      fecha: fechaFinal // Asegurar que la salida siempre tenga una fecha
    });
    const savedSalida = await this.salidasRepository.save(salida);
    
    // Crear automáticamente un ingreso por la venta
    try {
      let monto = 0;
      let descripcion = '';
      
      if (canasta) {
        monto = createSalidaDto.unidades * canasta.valorCanasta;
        descripcion = `Venta de ${createSalidaDto.unidades} ${canasta.nombre} de ${tipoHuevo.nombre}`;
      } else {
        // Si no hay canasta, usar el valor proporcionado o calcular basado en el tipo de huevo
        monto = createSalidaDto.valor || (createSalidaDto.unidades * tipoHuevo.valorUnidad);
      }
      
      await this.ingresosService.create({
        monto,
        fecha: fechaFinal, // Usar la misma fecha que la salida
        descripcion,
        observaciones: `Generado automáticamente desde salida ${savedSalida.id}`,
        tipo: 'venta',
        salidaId: savedSalida.id,
      });
    } catch (error) {
      // Log del error pero no fallar la creación de la salida
      console.error('Error al crear ingreso automático:', error);
    }
    
    return savedSalida;
  }

  async findAll(): Promise<Salida[]> {
    return this.salidasRepository.find({
      relations: ['tipoHuevo', 'canasta'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Salida> {
    const salida = await this.salidasRepository.findOne({
      where: { id },
      relations: ['tipoHuevo', 'canasta']
    });
    
    if (!salida) {
      throw new NotFoundException(`Salida con ID ${id} no encontrada`);
    }
    
    return salida;
  }

  async update(id: string, updateSalidaDto: UpdateSalidaDto): Promise<Salida> {
    const salida = await this.findOne(id);
    const unidadesOriginales = salida.unidades;
    const tipoHuevoOriginal = salida.tipoHuevoId;
    
    // Validar tipo de huevo si se está actualizando
    if (updateSalidaDto.tipoHuevoId) {
      await this.tiposHuevoService.findOne(updateSalidaDto.tipoHuevoId);
    }
    
    // Validar canasta si se está actualizando
    if (updateSalidaDto.canastaId) {
      await this.canastasService.findOne(updateSalidaDto.canastaId);
    }
    
    // Si cambian las unidades o el tipo de huevo, ajustar inventario
    if (updateSalidaDto.unidades !== undefined || updateSalidaDto.tipoHuevoId) {
      const nuevoTipoHuevo = updateSalidaDto.tipoHuevoId || tipoHuevoOriginal;
      const nuevasUnidades = updateSalidaDto.unidades !== undefined ? updateSalidaDto.unidades : unidadesOriginales;
      
      // Restaurar inventario original
      await this.inventarioStockService.aumentarStock(tipoHuevoOriginal, unidadesOriginales);
      
      // Reducir inventario con nuevos valores
      await this.inventarioStockService.reducirStock(nuevoTipoHuevo, nuevasUnidades);
    }
    
    Object.assign(salida, updateSalidaDto);
    return this.salidasRepository.save(salida);
  }

  async remove(id: string): Promise<void> {
    const salida = await this.findOne(id);
    await this.salidasRepository.remove(salida);
  }

  async getSalidasDiarias(fechaInicio: string, fechaFin: string): Promise<any[]> {
    const query = `
      SELECT 
        salida.fecha as fecha,
        SUM(
          CASE 
            WHEN salida."canastaId" IS NOT NULL THEN salida.unidades * canasta."unidadesPorCanasta"
            ELSE salida.unidades
          END
        ) as salidas
      FROM salidas salida
      LEFT JOIN canastas canasta ON salida."canastaId" = canasta.id
      WHERE salida.fecha BETWEEN $1 AND $2
      GROUP BY salida.fecha
      ORDER BY fecha ASC
    `;
    
    return this.salidasRepository.query(query, [fechaInicio, fechaFin]);
  }

  async getCanastasDiarias(fechaInicio: string, fechaFin: string): Promise<any[]> {
    const query = `
      SELECT 
        salida.fecha as fecha,
        SUM(salida.unidades) as canastas
      FROM salidas salida
      WHERE salida.fecha BETWEEN $1 AND $2
      GROUP BY salida.fecha
      ORDER BY fecha ASC
    `;
    
    return this.salidasRepository.query(query, [fechaInicio, fechaFin]);
  }
}