import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { GastosService } from './gastos.service';
import { IngresosService } from './ingresos.service';
import { ResumenService } from './resumen.service';
import { GalponesService } from '../galpones/galpones.service';
import { EntradasProduccionService } from '../entradas-produccion/entradas-produccion.service';
import { SalidasService } from '../salidas/salidas.service';
import { ResumenService as InventarioResumenService } from '../inventario/resumen.service';

@Controller('finanzas')
export class FinanzasController {
  constructor(
    private readonly gastosService: GastosService,
    private readonly ingresosService: IngresosService,
    private readonly resumenService: ResumenService,
    private readonly galponesService: GalponesService,
    private readonly entradasProduccionService: EntradasProduccionService,
    private readonly salidasService: SalidasService,
    private readonly inventarioResumenService: InventarioResumenService,
  ) {}

  @Get('resumen')
  async getResumenFinanciero(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    let totalIngresos: number;
    let totalGastos: number;
    let totalGastosOperativos: number;
    let totalInversionInicial: number;
    let gastosPorCategoria: any[];
    let ingresosPorTipo: any[];

    if (fechaInicio && fechaFin) {
      totalIngresos = await this.ingresosService.getTotalIngresosByDateRange(fechaInicio, fechaFin);
      totalGastos = await this.gastosService.getTotalGastosByDateRange(fechaInicio, fechaFin);
      totalGastosOperativos = await this.gastosService.getTotalGastosByDateRangeExcluyendoInversion(fechaInicio, fechaFin);
    } else {
      totalIngresos = await this.ingresosService.getTotalIngresos();
      totalGastos = await this.gastosService.getTotalGastos();
      totalGastosOperativos = await this.gastosService.getTotalGastosExcluyendoInversion();
    }

    // Obtener inversión inicial total (no por rango de fechas)
    totalInversionInicial = await this.gastosService.getTotalInversionInicial();
    
    gastosPorCategoria = await this.gastosService.getTotalGastosByCategoria();
    ingresosPorTipo = await this.ingresosService.getTotalIngresosByTipo();
    
    // Cálculos financieros
    const utilidadOperativa = totalIngresos - totalGastosOperativos;
    const utilidadNeta = totalIngresos - totalGastos;
    const margenUtilidad = totalIngresos > 0 ? (utilidadOperativa / totalIngresos) * 100 : 0;
    const recuperacionInversion = totalInversionInicial > 0 ? (utilidadOperativa / totalInversionInicial) * 100 : 0;

    return {
      totalIngresos,
      totalGastos,
      totalGastosOperativos,
      totalInversionInicial,
      utilidadOperativa,
      utilidadNeta,
      margenUtilidad: parseFloat(margenUtilidad.toFixed(2)),
      recuperacionInversion: parseFloat(recuperacionInversion.toFixed(2)),
      gastosPorCategoria,
      ingresosPorTipo,
      periodo: fechaInicio && fechaFin ? {
        fechaInicio,
        fechaFin
      } : null
    };
  }

  @Get('comparativo-mensual')
  async getComparativoMensual(@Query('año') año?: string) {
    const añoActual = año ? parseInt(año) : new Date().getFullYear();
    const meses = [];
    
    // Obtener inversión inicial total una sola vez
    const totalInversionInicial = await this.gastosService.getTotalInversionInicial();

    for (let mes = 1; mes <= 12; mes++) {
      const fechaInicio = `${añoActual}-${mes.toString().padStart(2, '0')}-01`;
      const ultimoDia = new Date(añoActual, mes, 0).getDate();
      const fechaFin = `${añoActual}-${mes.toString().padStart(2, '0')}-${ultimoDia}`;

      const ingresos = await this.ingresosService.getTotalIngresosByDateRange(fechaInicio, fechaFin);
      const gastosTotal = await this.gastosService.getTotalGastosByDateRange(fechaInicio, fechaFin);
      const gastosOperativos = await this.gastosService.getTotalGastosByDateRangeExcluyendoInversion(fechaInicio, fechaFin);
      
      const utilidadOperativa = ingresos - gastosOperativos;
      const utilidadNeta = ingresos - gastosTotal;
      const margenUtilidad = ingresos > 0 ? (utilidadOperativa / ingresos) * 100 : 0;

      meses.push({
        mes,
        nombreMes: new Date(añoActual, mes - 1).toLocaleString('es', { month: 'long' }),
        ingresos,
        gastosTotal,
        gastosOperativos,
        utilidadOperativa,
        utilidadNeta,
        margenUtilidad: parseFloat(margenUtilidad.toFixed(2))
      });
    }

    return {
      año: añoActual,
      totalInversionInicial,
      meses
    };
  }

  @Get('kpis')
  async getKPIsFinancieros(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    const resumen = await this.getResumenFinanciero(fechaInicio, fechaFin);
    
    // Calcular KPIs adicionales
    const promedioGastoDiario = fechaInicio && fechaFin ? 
      this.calcularPromedioGastoDiario(resumen.totalGastos, fechaInicio, fechaFin) : 0;
    
    const promedioIngresoDiario = fechaInicio && fechaFin ? 
      this.calcularPromedioIngresoDiario(resumen.totalIngresos, fechaInicio, fechaFin) : 0;

    return {
      ...resumen,
      promedioGastoDiario: parseFloat(promedioGastoDiario.toFixed(2)),
      promedioIngresoDiario: parseFloat(promedioIngresoDiario.toFixed(2)),
      ratioIngresoGasto: resumen.totalGastos > 0 ? 
        parseFloat((resumen.totalIngresos / resumen.totalGastos).toFixed(2)) : 0,
    };
  }

  @Get('dashboard-kpis')
  async getDashboardKpis() {
    try {
      // Obtener fecha actual para calcular datos del mes
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const fechaInicio = startOfMonth.toISOString().split('T')[0];
      const fechaFin = endOfMonth.toISOString().split('T')[0];

      // Obtener producción total del mes (entradas de producción)
      const entradasDelMes = await this.entradasProduccionService.findByDateRange(fechaInicio, fechaFin);
      const produccionTotal = entradasDelMes.reduce((total, entrada) => total + entrada.unidades, 0);

      // Obtener ingresos del mes
      const ingresosDelMes = await this.ingresosService.getTotalIngresosByDateRange(fechaInicio, fechaFin);

      // Obtener inventario actual total
      const resumenInventario = await this.inventarioResumenService.getInventarioResumen();
      const inventarioActual = Object.values(resumenInventario).reduce((total: number, item: any) => {
        return total + (item.stockActual || 0);
      }, 0);

      // Obtener galpones y estadísticas
      const galpones = await this.galponesService.findAll();
      const galponesActivos = galpones.filter(g => g.activo).length;
      const totalGalpones = galpones.length;
      
      // Calcular gallinas totales y activas (basado en capacidad de galpones)
      const gallinasTotal = galpones.reduce((total, galpon) => total + (galpon.capacidad || 0), 0);
      const gallinasActivas = galpones
        .filter(g => g.activo)
        .reduce((total, galpon) => total + (galpon.capacidad || 0), 0);

      return {
        produccionTotal,
        ingresosDelMes: Math.round(ingresosDelMes / 1000), // En miles
        inventarioActual,
        galponesActivos,
        totalGalpones,
        gallinasTotal,
        gallinasActivas
      };
    } catch (error) {
      console.error('Error getting dashboard KPIs:', error);
      throw error;
    }
  }

  private calcularPromedioGastoDiario(totalGastos: number, fechaInicio: string, fechaFin: string): number {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diasDiferencia = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diasDiferencia > 0 ? totalGastos / diasDiferencia : 0;
  }

  private calcularPromedioIngresoDiario(totalIngresos: number, fechaInicio: string, fechaFin: string): number {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diasDiferencia = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diasDiferencia > 0 ? totalIngresos / diasDiferencia : 0;
  }

  @Post('inversion-inicial')
  async setInversionInicial(
    @Body() inversionData: { montoTotal: number; fechaInicio: string; metaRecuperacion?: number }
  ) {
    try {
      // Crear o actualizar el gasto de inversión inicial
      const resultado = await this.gastosService.createOrUpdateInversionInicial(
        inversionData.montoTotal,
        inversionData.fechaInicio,
        inversionData.metaRecuperacion
      );
      
      return {
        success: true,
        message: 'Inversión inicial registrada exitosamente',
        data: resultado
      };
    } catch (error) {
      console.error('Error setting inversion inicial:', error);
      throw error;
    }
  }

  @Get('datos-diarios')
  async getDatosDiarios(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    try {
      let inicio = fechaInicio;
      let fin = fechaFin;
      
      // Si no se proporcionan fechas, usar el mes actual
      if (!inicio || !fin) {
        const ahora = new Date();
        const año = ahora.getFullYear();
        const mes = ahora.getMonth();
        
        const primerDia = new Date(año, mes, 1);
        const ultimoDia = new Date(año, mes + 1, 0);
        
        inicio = primerDia.toISOString().split('T')[0];
        fin = ultimoDia.toISOString().split('T')[0];
      }
      
      // Obtener datos diarios
      const ingresosDiarios = await this.ingresosService.getIngresosDiarios(inicio, fin);
      const produccionDiaria = await this.entradasProduccionService.getProduccionDiaria(inicio, fin);
      const salidasDiarias = await this.salidasService.getSalidasDiarias(inicio, fin);
      const canastasDiarias = await this.salidasService.getCanastasDiarias(inicio, fin);
      const gastosDiarios = await this.gastosService.getGastosDiarios(inicio, fin);
      
      // Combinar datos por fecha
      const datosCombinados: Record<string, any> = {};
      
      // Procesar ingresos
      ingresosDiarios.forEach((ingreso: any) => {
        // Formatear fecha a YYYY-MM-DD
        const fecha = new Date(ingreso.fecha).toISOString().split('T')[0];
        if (!datosCombinados[fecha]) {
          datosCombinados[fecha] = { ingresos: 0, produccion: 0, salidas: 0, canastas: 0, gastos: 0 };
        }
        datosCombinados[fecha].ingresos = parseFloat(ingreso.total) || 0;
      });
      
      // Procesar producción
      produccionDiaria.forEach((produccion: any) => {
        // Formatear fecha a YYYY-MM-DD
        const fecha = new Date(produccion.fecha).toISOString().split('T')[0];
        if (!datosCombinados[fecha]) {
          datosCombinados[fecha] = { ingresos: 0, produccion: 0, salidas: 0, canastas: 0, gastos: 0 };
        }
        datosCombinados[fecha].produccion = parseInt(produccion.total) || 0;
      });
      
      // Procesar salidas
      salidasDiarias.forEach((salida: any) => {
        // Formatear fecha a YYYY-MM-DD
        const fecha = new Date(salida.fecha).toISOString().split('T')[0];
        if (!datosCombinados[fecha]) {
          datosCombinados[fecha] = { ingresos: 0, produccion: 0, salidas: 0, canastas: 0, gastos: 0 };
        }
        datosCombinados[fecha].salidas = parseInt(salida.salidas) || 0;
      });
      
      // Procesar canastas
      canastasDiarias.forEach((canasta: any) => {
        // Formatear fecha a YYYY-MM-DD
        const fecha = new Date(canasta.fecha).toISOString().split('T')[0];
        if (!datosCombinados[fecha]) {
          datosCombinados[fecha] = { ingresos: 0, produccion: 0, salidas: 0, canastas: 0, gastos: 0 };
        }
        datosCombinados[fecha].canastas = parseInt(canasta.canastas) || 0;
      });
      
      // Procesar gastos
      gastosDiarios.forEach((gasto: any) => {
        // Formatear fecha a YYYY-MM-DD
        const fecha = new Date(gasto.fecha).toISOString().split('T')[0];
        if (!datosCombinados[fecha]) {
          datosCombinados[fecha] = { ingresos: 0, produccion: 0, salidas: 0, canastas: 0, gastos: 0 };
        }
        datosCombinados[fecha].gastos = parseFloat(gasto.total) || 0;
      });
      
      return datosCombinados;
    } catch (error) {
      console.error('Error getting daily data:', error);
      throw error;
    }
  }
}