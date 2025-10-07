import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntradaProduccion } from '../entradas-produccion/entities/entrada-produccion.entity';
import { Salida } from '../salidas/entities/salida.entity';
import { Inventario } from './entities/inventario.entity';

@Injectable()
export class ResumenService {
  constructor(
    @InjectRepository(EntradaProduccion)
    private entradasRepository: Repository<EntradaProduccion>,
    @InjectRepository(Salida)
    private salidasRepository: Repository<Salida>,
    @InjectRepository(Inventario)
    private inventarioRepository: Repository<Inventario>,
  ) {}

  async getInventarioResumen(galponId?: string, tipoHuevoId?: string, id_empresa?: number) {
    if (!id_empresa) {
      throw new Error('No hay empresa asociada al usuario logueado');
    }
    
    // Construir query para entradas
    const entradasQuery = this.entradasRepository
      .createQueryBuilder('entrada')
      .leftJoinAndSelect('entrada.galpon', 'galpon')
      .leftJoinAndSelect('entrada.tipoHuevo', 'tipoHuevo')
      .where('entrada.id_empresa = :id_empresa', { id_empresa });

    if (galponId) {
      entradasQuery.andWhere('entrada.galponId = :galponId', { galponId });
    }
    if (tipoHuevoId) {
      entradasQuery.andWhere('entrada.tipoHuevoId = :tipoHuevoId', { tipoHuevoId });
    }

    // Construir query para salidas
    const salidasQuery = this.salidasRepository
      .createQueryBuilder('salida')
      .leftJoinAndSelect('salida.tipoHuevo', 'tipoHuevo');

    if (tipoHuevoId) {
      salidasQuery.andWhere('salida.tipoHuevoId = :tipoHuevoId', { tipoHuevoId });
    }

    // Construir query para inventario actual
    const inventarioQuery = this.inventarioRepository
      .createQueryBuilder('inventario')
      .leftJoinAndSelect('inventario.tipoHuevo', 'tipoHuevo');

    if (tipoHuevoId) {
      inventarioQuery.andWhere('inventario.tipoHuevoId = :tipoHuevoId', { tipoHuevoId });
    }

    // Ejecutar queries
    const [entradas, salidas, inventarioActual] = await Promise.all([
      entradasQuery.getMany(),
      salidasQuery.getMany(),
      inventarioQuery.getMany(),
    ]);

    // Procesar datos para crear el resumen
    const resumen = {};

    // Procesar entradas
    entradas.forEach(entrada => {
      const key = galponId ? `${entrada.galponId}-${entrada.tipoHuevoId}` : entrada.tipoHuevoId;
      
      if (!resumen[key]) {
        resumen[key] = {
          galponId: entrada.galponId,
          galpon: entrada.galpon,
          tipoHuevoId: entrada.tipoHuevoId,
          tipoHuevo: entrada.tipoHuevo,
          totalEntradas: 0,
          totalSalidas: 0,
          stockActual: 0,
          valorTotal: 0,
        };
      }
      
      resumen[key].totalEntradas += entrada.unidades;
    });

    // Procesar salidas
    salidas.forEach(salida => {
      const key = galponId ? `${galponId}-${salida.tipoHuevoId}` : salida.tipoHuevoId;
      
      if (!resumen[key]) {
        resumen[key] = {
          galponId: galponId || null,
          galpon: null,
          tipoHuevoId: salida.tipoHuevoId,
          tipoHuevo: salida.tipoHuevo,
          totalEntradas: 0,
          totalSalidas: 0,
          stockActual: 0,
          valorTotal: 0,
        };
      }
      
      resumen[key].totalSalidas += salida.unidades;
    });

    // Procesar inventario actual
    inventarioActual.forEach(inv => {
      const key = galponId ? `${galponId}-${inv.tipoHuevoId}` : inv.tipoHuevoId;
      
      if (!resumen[key]) {
        resumen[key] = {
          galponId: galponId || null,
          galpon: null,
          tipoHuevoId: inv.tipoHuevoId,
          tipoHuevo: inv.tipoHuevo,
          totalEntradas: 0,
          totalSalidas: 0,
          stockActual: 0,
          valorTotal: 0,
        };
      }
      
      resumen[key].stockActual = inv.unidades;
    });

    // Convertir a array y calcular valores
    const resultado = Object.values(resumen).map((item: any) => {
      // Calcular stock basado en entradas - salidas si no hay inventario actual
      if (item.stockActual === 0) {
        item.stockActual = item.totalEntradas - item.totalSalidas;
      }
      
      // Calcular valor total: stock actual * valor unitario del tipo de huevo
      item.valorTotal = item.stockActual * (item.tipoHuevo?.valorUnidad || 0);
      
      return item;
    });

    return resultado;
  }
}