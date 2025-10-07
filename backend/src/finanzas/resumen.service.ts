import { Injectable } from '@nestjs/common';
import { GastosService } from './gastos.service';
import { SalidasService } from '../salidas/salidas.service';
import { IngresosService } from './ingresos.service';

@Injectable()
export class ResumenService {
  constructor(
    private readonly gastosService: GastosService,
    private readonly salidasService: SalidasService,
    private readonly ingresosService: IngresosService,
  ) {}

  async getResumenFinanciero(id_empresa: number) {
    // Obtener gastos separando inversión inicial
    const totalGastos = await this.gastosService.getTotalGastos(id_empresa);
    const totalGastosOperativos = await this.gastosService.getTotalGastosExcluyendoInversion(id_empresa);
    const totalInversionInicial = await this.gastosService.getTotalInversionInicial(id_empresa);
    
    // Obtener o sincronizar ingresos desde salidas
    const ingresos = await this.ingresosService.syncIngresosFromSalidas(id_empresa);
    const totalIngresos = await this.ingresosService.getTotalIngresos(id_empresa);
    
    // Obtener datos para el resumen
    const gastos = await this.gastosService.findAll(id_empresa);
    const salidas = await this.salidasService.findAll(id_empresa);
    
    // Cálculos financieros
    const utilidadOperativa = totalIngresos - totalGastosOperativos;
    const utilidadNeta = totalIngresos - totalGastos;
    const recuperacionInversion = totalInversionInicial > 0 ? (utilidadOperativa / totalInversionInicial) * 100 : 0;
    
    return {
      totalGastos,
      totalGastosOperativos,
      totalInversionInicial,
      totalIngresos,
      utilidadOperativa,
      utilidadNeta,
      recuperacionInversion: parseFloat(recuperacionInversion.toFixed(2)),
      gastos,
      salidas
    };
  }
}