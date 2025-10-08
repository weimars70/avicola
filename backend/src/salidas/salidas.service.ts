import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
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
    private dataSource: DataSource,
  ) {}

  async create(createSalidaDto: CreateSalidaDto, id_empresa: number): Promise<Salida> {
    // Validar que el tipo de huevo existe
    const tipoHuevo = await this.tiposHuevoService.findOne(createSalidaDto.tipoHuevoId);
    
    let canasta = null;
    let unidadesTotales = createSalidaDto.unidades;
    
    // Validar que la canasta existe solo si se proporciona
    if (createSalidaDto.canastaId) {
      canasta = await this.canastasService.findOne(createSalidaDto.canastaId, id_empresa);
      // Calcular unidades totales (canastas * unidades por canasta)
      unidadesTotales = createSalidaDto.unidades * canasta.unidadesPorCanasta;
    }
    
    // Reducir del inventario antes de crear la salida
    await this.inventarioStockService.reducirInventario(
      createSalidaDto.tipoHuevoId,
      unidadesTotales,
      id_empresa
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
        id_empresa: id_empresa, // Asegurar que se pase el id_empresa
        id_usuario_inserta: createSalidaDto.id_usuario_inserta, // Pasar el id_usuario_inserta
      });
    } catch (error) {
      // Log del error pero no fallar la creación de la salida
      console.error('Error al crear ingreso automático:', error);
    }
    
    return savedSalida;
  }

  async findAll(id_empresa: number): Promise<Salida[]> {
    return this.salidasRepository.find({
      where: { id_empresa },
      relations: ['tipoHuevo', 'canasta'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string, id_empresa: number): Promise<Salida> {
    const salida = await this.salidasRepository.findOne({
      where: { id, id_empresa },
      relations: ['tipoHuevo', 'canasta']
    });
    
    if (!salida) {
      throw new NotFoundException(`Salida con ID ${id} no encontrada`);
    }
    
    return salida;
  }

  async update(id: string, updateSalidaDto: UpdateSalidaDto, id_empresa: number): Promise<Salida> {
    const salida = await this.findOne(id, id_empresa);
    const unidadesOriginales = salida.unidades;
    const tipoHuevoOriginal = salida.tipoHuevoId;
    
    // Validar tipo de huevo si se está actualizando
    if (updateSalidaDto.tipoHuevoId) {
      await this.tiposHuevoService.findOne(updateSalidaDto.tipoHuevoId);
    }
    
    // Validar canasta si se está actualizando
    if (updateSalidaDto.canastaId && updateSalidaDto.id_empresa) {
      await this.canastasService.findOne(updateSalidaDto.canastaId, updateSalidaDto.id_empresa);
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
    
    // Asegurarse de que el valor se actualice si se cambian las unidades
    if (updateSalidaDto.unidades !== undefined && !updateSalidaDto.valor) {
      // Obtener el valor de la canasta actual
      let valorCanasta = 0;
      if (updateSalidaDto.canastaId) {
        const canasta = await this.canastasService.findOne(updateSalidaDto.canastaId, id_empresa);
        valorCanasta = canasta.valorCanasta;
      } else if (salida.canastaId) {
        const canasta = await this.canastasService.findOne(salida.canastaId, id_empresa);
        valorCanasta = canasta.valorCanasta;
      }
      
      // Actualizar el valor basado en las nuevas unidades
      if (valorCanasta > 0) {
        updateSalidaDto.valor = updateSalidaDto.unidades * valorCanasta;
      }
    }
    
    Object.assign(salida, updateSalidaDto);
    const salidaActualizada = await this.salidasRepository.save(salida);
    
    // Actualizar el ingreso relacionado si existe
    try {
      const ingresos = await this.dataSource.getRepository('ingresos').find({
        where: { salidaId: id }
      });
      
      if (ingresos && ingresos.length > 0) {
        const ingreso = ingresos[0];
        // Actualizar el monto del ingreso para que coincida con el valor de la salida
        await this.dataSource.getRepository('ingresos').update(
          { id: ingreso.id },
          { 
            monto: salidaActualizada.valor,
            descripcion: `Venta de ${salidaActualizada.unidades} unidades de ${salidaActualizada.tipoHuevo?.nombre || 'huevos'}`
          }
        );
      }
    } catch (error) {
      console.error('Error al actualizar el ingreso relacionado:', error);
    }
    
    return salidaActualizada;
  }

  async remove(id: string, id_empresa: number): Promise<void> {
    const salida = await this.findOne(id, id_empresa);
    await this.salidasRepository.remove(salida);
  }

  async getSalidasDiarias(fechaInicio: string, fechaFin: string, id_empresa?: number): Promise<any[]> {
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
      ${id_empresa ? 'AND salida.id_empresa = $3' : ''}
      GROUP BY salida.fecha
      ORDER BY fecha ASC
    `;
    
    return this.salidasRepository.query(query, id_empresa ? [fechaInicio, fechaFin, id_empresa] : [fechaInicio, fechaFin]);
  }

  async getCanastasDiarias(fechaInicio: string, fechaFin: string, id_empresa?: number): Promise<any[]> {
    const query = `
      SELECT 
        salida.fecha as fecha,
        SUM(salida.unidades) as canastas
      FROM salidas salida
      WHERE salida.fecha BETWEEN $1 AND $2
      ${id_empresa ? 'AND salida.id_empresa = $3' : ''}
      GROUP BY salida.fecha
      ORDER BY fecha ASC
    `;
    
    return this.salidasRepository.query(query, id_empresa ? [fechaInicio, fechaFin, id_empresa] : [fechaInicio, fechaFin]);
  }
}