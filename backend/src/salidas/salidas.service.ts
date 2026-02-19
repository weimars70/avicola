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
import { Ingreso } from '../finanzas/entities/ingreso.entity';

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
  ) { }

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

    // Determinar monto final considerando posibles descuentos enviados desde el frontend
    let monto = 0;
    let descripcion = '';
    if (typeof createSalidaDto.valor === 'number' && createSalidaDto.valor > 0) {
      // Si el frontend envía un valor explícito (total), respetarlo
      monto = createSalidaDto.valor;
    } else if (canasta) {
      monto = createSalidaDto.unidades * canasta.valorCanasta;
    } else {
      // Si no hay canasta, usar el valor unitario del tipo de huevo
      monto = createSalidaDto.unidades * tipoHuevo.valorUnidad;
    }

    const salida = this.salidasRepository.create({
      ...createSalidaDto,
      fecha: fechaFinal,
      valor: monto,
    });
    const savedSalida = await this.salidasRepository.save(salida);

    // Crear automáticamente un ingreso por la venta
    try {
      if (!descripcion) {
        descripcion = canasta
          ? `Venta de ${createSalidaDto.unidades} ${canasta.nombre} de ${tipoHuevo.nombre}`
          : `Venta de ${createSalidaDto.unidades} unidades de ${tipoHuevo.nombre}`;
      }

      await this.ingresosService.create({
        monto,
        fecha: fechaFinal,
        descripcion,
        observaciones: `Generado automáticamente desde salida ${savedSalida.id}`,
        tipo: 'venta',
        salidaId: savedSalida.id,
        id_empresa: id_empresa,
        id_usuario_inserta: createSalidaDto.id_usuario_inserta,
      });
    } catch (error) {
      // Log del error pero no fallar la creación de la salida
      console.error('Error al crear ingreso automático:', error);
    }

    return savedSalida;
  }

  async findAll(id_empresa: number): Promise<Salida[]> {
    return this.salidasRepository.find({
      where: { id_empresa, tipoHuevo: { id_empresa } },
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

    // Si cambian las unidades, tipo de huevo o canasta, ajustar inventario
    if (updateSalidaDto.unidades !== undefined || updateSalidaDto.tipoHuevoId || updateSalidaDto.canastaId !== undefined) {
      const nuevoTipoHuevo = updateSalidaDto.tipoHuevoId || tipoHuevoOriginal;
      const nuevasUnidades = updateSalidaDto.unidades !== undefined ? updateSalidaDto.unidades : unidadesOriginales;
      const canastaOriginalId = salida.canastaId;
      const nuevaCanastaId = updateSalidaDto.canastaId !== undefined ? updateSalidaDto.canastaId : canastaOriginalId;

      // Calcular unidades totales ORIGINALES (en huevos)
      let unidadesTotalesOriginales = unidadesOriginales;
      if (canastaOriginalId) {
        const canastaOriginal = await this.canastasService.findOne(canastaOriginalId, id_empresa);
        unidadesTotalesOriginales = unidadesOriginales * canastaOriginal.unidadesPorCanasta;
      }

      // Calcular unidades totales NUEVAS (en huevos)
      let unidadesTotalesNuevas = nuevasUnidades;
      if (nuevaCanastaId) {
        const canastaNueva = await this.canastasService.findOne(nuevaCanastaId, id_empresa);
        unidadesTotalesNuevas = nuevasUnidades * canastaNueva.unidadesPorCanasta;
      }

      // Restaurar inventario original (devolver los huevos que se habían restado)
      await this.inventarioStockService.aumentarStock(tipoHuevoOriginal, unidadesTotalesOriginales);

      // Reducir inventario con nuevos valores (restar los huevos actualizados)
      await this.inventarioStockService.reducirStock(nuevoTipoHuevo, unidadesTotalesNuevas);
    }

    // Calcular valor automáticamente si cambiaron unidades o canasta, y no se envía un valor explícito
    if ((updateSalidaDto.unidades !== undefined || updateSalidaDto.canastaId !== undefined) && !updateSalidaDto.valor) {
      // Obtener el valor de la canasta actual (nueva o existente)
      let valorCanasta = 0;
      const canastaIdParaCalculo = updateSalidaDto.canastaId !== undefined ? updateSalidaDto.canastaId : salida.canastaId;

      if (canastaIdParaCalculo) {
        const canasta = await this.canastasService.findOne(canastaIdParaCalculo, id_empresa);
        valorCanasta = canasta.valorCanasta;
      }

      // Actualizar el valor basado en las unidades (nuevas o existentes)
      const unidadesParaCalculo = updateSalidaDto.unidades !== undefined ? updateSalidaDto.unidades : salida.unidades;

      if (valorCanasta > 0) {
        updateSalidaDto.valor = unidadesParaCalculo * valorCanasta;
      }
    }

    Object.assign(salida, updateSalidaDto);
    const salidaActualizada = await this.salidasRepository.save(salida);

    // Actualizar el ingreso relacionado si existe
    try {
      const ingresosRepo = this.dataSource.getRepository(Ingreso);
      const ingresos = await ingresosRepo.find({
        where: { salidaId: id, id_empresa }
      });

      if (ingresos && ingresos.length > 0) {
        const ingreso = ingresos[0];
        // Actualizar el monto del ingreso para que coincida con el valor de la salida
        await ingresosRepo.update(
          { id: ingreso.id },
          {
            monto: salidaActualizada.valor,
            descripcion: `Venta de ${salidaActualizada.unidades} unidades de ${salidaActualizada.tipoHuevo?.nombre || 'huevos'}`,
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

    // Calcular unidades totales a devolver al inventario
    let unidadesTotales = salida.unidades;
    if (salida.canastaId) {
      const canasta = await this.canastasService.findOne(salida.canastaId, id_empresa);
      unidadesTotales = salida.unidades * canasta.unidadesPorCanasta;
    }

    // Devolver el inventario antes de eliminar (restaurar los huevos que se habían restado)
    await this.inventarioStockService.aumentarStock(salida.tipoHuevoId, unidadesTotales);

    // Eliminar la salida
    await this.salidasRepository.remove(salida);

    // Eliminar también el ingreso relacionado si existe
    try {
      const ingresosRepo = this.dataSource.getRepository(Ingreso);
      const ingresos = await ingresosRepo.find({
        where: { salidaId: id, id_empresa }
      });
      if (ingresos && ingresos.length > 0) {
        await ingresosRepo.remove(ingresos);
      }
    } catch (error) {
      console.error('Error al eliminar el ingreso relacionado:', error);
    }
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
      LEFT JOIN tipos_huevo th ON salida."tipoHuevoId" = th.id
      WHERE salida.fecha BETWEEN $1 AND $2
      ${id_empresa ? 'AND salida.id_empresa = $3 AND th.id_empresa = $3' : ''}
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

  async getResumenCanastas(fechaInicio: string, fechaFin: string, id_empresa?: number): Promise<any[]> {
    const query = `
      SELECT 
        canasta.nombre as "nombreCanasta",
        SUM(salida.unidades) as "cantidadVendida",
        SUM(salida.valor) as "totalVenta"
      FROM salidas salida
      INNER JOIN canastas canasta ON salida."canastaId" = canasta.id
      WHERE salida.fecha BETWEEN $1 AND $2
      ${id_empresa ? 'AND salida.id_empresa = $3' : ''}
      GROUP BY canasta.id, canasta.nombre
      ORDER BY "cantidadVendida" DESC
    `;

    return this.salidasRepository.query(query, id_empresa ? [fechaInicio, fechaFin, id_empresa] : [fechaInicio, fechaFin]);
  }
}