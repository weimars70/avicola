import { Injectable } from '@nestjs/common';
import { GastosService } from './gastos.service';
import { SalidasService } from '../salidas/salidas.service';
import { EntradasProduccionService } from '../entradas-produccion/entradas-produccion.service';

export interface ActividadReciente {
  id: string;
  descripcion: string;
  fecha: Date;
  tipo: 'entrada' | 'salida' | 'gasto';
  icon: string;
  color: 'positive' | 'negative' | 'warning';
  monto?: number;
}

@Injectable()
export class ActividadesService {
  constructor(
    private readonly gastosService: GastosService,
    private readonly salidasService: SalidasService,
    private readonly entradasProduccionService: EntradasProduccionService,
  ) {}

  async getActividadesRecientes(limit: number = 10): Promise<ActividadReciente[]> {
    const actividades: ActividadReciente[] = [];

    try {
      // Obtener entradas recientes
      const entradas = await this.entradasProduccionService.findAll();
      const entradasRecientes = entradas.slice(0, 20); // Obtener las 20 más recientes
      
      entradasRecientes.forEach(entrada => {
        actividades.push({
          id: `entrada-${entrada.id}`,
          descripcion: `Entrada de ${entrada.unidades} ${entrada.tipoHuevo?.nombre || 'huevos'} en ${entrada.galpon?.nombre || 'galpón'}`,
          fecha: entrada.createdAt,
          tipo: 'entrada',
          icon: 'arrow_downward',
          color: 'positive'
        });
      });

      // Obtener salidas recientes
      const salidas = await this.salidasService.findAll();
      const salidasRecientes = salidas.slice(0, 20); // Obtener las 20 más recientes
      
      salidasRecientes.forEach(salida => {
        const valorTotal = salida.unidades * (salida.canasta?.valorCanasta || 0);
        actividades.push({
          id: `salida-${salida.id}`,
          descripcion: `Salida de ${salida.unidades} canastas de ${salida.tipoHuevo?.nombre || 'huevos'}`,
          fecha: salida.createdAt,
          tipo: 'salida',
          icon: 'arrow_upward',
          color: 'negative',
          monto: valorTotal
        });
      });

      // Obtener gastos recientes
      const gastos = await this.gastosService.findAll();
      const gastosRecientes = gastos.slice(0, 20); // Obtener los 20 más recientes
      
      gastosRecientes.forEach(gasto => {
        actividades.push({
          id: `gasto-${gasto.id}`,
          descripcion: `Gasto: ${gasto.descripcion} - ${gasto.categoria?.nombre || 'Sin categoría'}`,
          fecha: new Date(gasto.fecha),
          tipo: 'gasto',
          icon: 'payment',
          color: 'warning',
          monto: gasto.monto
        });
      });

      // Ordenar por fecha (más recientes primero) y limitar
      return actividades
        .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
        .slice(0, limit);
        
    } catch (error) {
      console.error('Error obteniendo actividades recientes:', error);
      return [];
    }
  }
}