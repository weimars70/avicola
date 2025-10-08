import { Controller, Get, Query, Post, Body, ParseIntPipe, BadRequestException } from '@nestjs/common';
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
    @Query('id_empresa') id_empresa?: string,
  ) {
    if (!id_empresa) {
      throw new Error('No hay empresa asociada al usuario logueado');
    }
    const id_empresa_num = parseInt(id_empresa);
    let totalIngresos: number;
    let totalGastos: number;
    let totalGastosOperativos: number;
    let totalInversionInicial: number;
    let gastosPorCategoria: any[];
    let ingresosPorTipo: any[];

    if (fechaInicio && fechaFin) {
      totalIngresos = await this.ingresosService.getTotalIngresosByDateRange(fechaInicio, fechaFin, id_empresa_num);
      totalGastos = await this.gastosService.getTotalGastosByDateRange(fechaInicio, fechaFin, id_empresa_num);
      totalGastosOperativos = await this.gastosService.getTotalGastosByDateRangeExcluyendoInversion(fechaInicio, fechaFin, id_empresa_num);
    } else {
      totalIngresos = await this.ingresosService.getTotalIngresos(id_empresa_num);
      totalGastos = await this.gastosService.getTotalGastos(id_empresa_num);
      totalGastosOperativos = await this.gastosService.getTotalGastosExcluyendoInversion(id_empresa_num);
    }

    // Obtener inversión inicial total (no por rango de fechas)
    totalInversionInicial = await this.gastosService.getTotalInversionInicial(id_empresa_num);
    
    gastosPorCategoria = await this.gastosService.getTotalGastosByCategoria(id_empresa_num);
    ingresosPorTipo = await this.ingresosService.getTotalIngresosByTipo(id_empresa_num);
    
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
  async getComparativoMensual(
    @Query('anio') anio?: string,
    @Query('id_empresa') id_empresa?: string,
  ) {
    try {
      const id_empresa_num = id_empresa ? parseInt(id_empresa) : 1;
      const anioActual = anio ? parseInt(anio) : new Date().getFullYear();
      
      // Obtener datos de inversión inicial
      const totalInversionInicial = await this.gastosService.getTotalInversionInicial(id_empresa_num);
      
      // Inicializar arrays para almacenar datos mensuales
      const meses = [];
      const ingresosMensuales = [];
      const gastosMensuales = [];
      const utilidadesMensuales = [];
      
      // Calcular datos para cada mes
      for (let mes = 0; mes < 12; mes++) {
        const fechaInicio = new Date(anioActual, mes, 1).toISOString().split('T')[0];
        const fechaFin = new Date(anioActual, mes + 1, 0).toISOString().split('T')[0];
        
        // Obtener ingresos y gastos del mes
        const ingresos = await this.ingresosService.getTotalIngresosByDateRange(fechaInicio, fechaFin, id_empresa_num);
        const gastosTotal = await this.gastosService.getTotalGastosByDateRange(fechaInicio, fechaFin, id_empresa_num);
        const gastosOperativos = await this.gastosService.getTotalGastosByDateRangeExcluyendoInversion(fechaInicio, fechaFin, id_empresa_num);
        
        // Calcular utilidades y margen
        const utilidadOperativa = ingresos - gastosOperativos;
        const utilidadNeta = ingresos - gastosTotal;
        const margenUtilidad = ingresos > 0 ? (utilidadOperativa / ingresos) * 100 : 0;
        
        meses.push({
          mes,
          nombreMes: new Date(anioActual, mes).toLocaleString('es', { month: 'long' }),
          ingresos,
          gastosTotal,
          gastosOperativos,
          utilidadOperativa,
          utilidadNeta,
          margenUtilidad: parseFloat(margenUtilidad.toFixed(2))
        });
      }

      return {
        anio: anioActual,
        totalInversionInicial,
        meses
      };
    } catch (error) {
      console.error('Error en comparativo mensual:', error);
      throw error;
    }
  }

  @Get('kpis')
  async getKPIsFinancieros(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('id_empresa') id_empresa?: string,
  ) {
    const resumen = await this.getResumenFinanciero(fechaInicio, fechaFin, id_empresa);
    
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
  async getDashboardKpis(@Query('id_empresa') id_empresa?: string) {
    try {
      if (!id_empresa) {
        throw new Error('No hay empresa asociada al usuario logueado');
      }
      const id_empresa_num = parseInt(id_empresa);
      
      // Obtener fecha actual para calcular datos del mes
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      const fechaInicio = startOfMonth.toISOString().split('T')[0];
      const fechaFin = endOfMonth.toISOString().split('T')[0];

      // Obtener producción total del mes (entradas de producción)
      const entradasDelMes = await this.entradasProduccionService.findByDateRange(fechaInicio, fechaFin, id_empresa_num);
      const produccionTotal = entradasDelMes.reduce((total, entrada) => total + entrada.unidades, 0);

      // Obtener ingresos del mes
      const ingresosDelMes = await this.ingresosService.getTotalIngresosByDateRange(fechaInicio, fechaFin, id_empresa_num);

      // Obtener inventario actual total
      const resumenInventario = await this.inventarioResumenService.getInventarioResumen(null, null, id_empresa_num);
      console.log('Estructura de resumenInventario:', JSON.stringify(resumenInventario, null, 2));
      
      // Filtramos explícitamente por id_empresa desde el tipoHuevo
      const inventarioActual = Object.values(resumenInventario)
        .filter((item: any) => item.tipoHuevo && item.tipoHuevo.id_empresa === id_empresa_num)
        .reduce((total: number, item: any) => {
          console.log('Item de inventario filtrado:', item);
          return total + (item.stockActual || 0);
        }, 0);

      // Obtener galpones y estadísticas
      const galpones = await this.galponesService.findAll(id_empresa_num);
      const galponesActivos = galpones.filter(g => g.activo).length;
      const totalGalpones = galpones.length;
      
      // Calcular gallinas totales y activas (basado en capacidad de galpones)
      // Para gallinas totales, contamos las de todos los galpones (activos e inactivos)
      const gallinasTotal = galpones
        .reduce((total, galpon) => total + (galpon.capacidad || 0), 0);
      // Para gallinas activas, solo contamos las de galpones activos
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
    @Body() inversionData: { montoTotal: number; fechaInicio: string; metaRecuperacion?: number },
    @Query('id_empresa', new ParseIntPipe()) id_empresa: number,
    @Query('id_usuario_inserta') id_usuario_inserta: string
  ) {
    try {
      // Validar que existan los parámetros obligatorios
      if (!id_empresa || !id_usuario_inserta) {
        throw new BadRequestException('id_empresa e id_usuario_inserta son obligatorios');
      }
      
      // Crear o actualizar el gasto de inversión inicial
      const resultado = await this.gastosService.createOrUpdateInversionInicial(
        inversionData.montoTotal,
        inversionData.fechaInicio,
        inversionData.metaRecuperacion,
        id_empresa,
        id_usuario_inserta
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
    @Query('id_empresa') id_empresa?: string,
  ) {
    try {
      let inicio = fechaInicio;
      let fin = fechaFin;
      
      // Si no se proporcionan fechas, usar los últimos 7 días para mejorar rendimiento
      if (!inicio || !fin) {
        const ahora = new Date();
        const hace7Dias = new Date(ahora);
        hace7Dias.setDate(ahora.getDate() - 7);
        
        inicio = hace7Dias.toISOString().split('T')[0];
        fin = ahora.toISOString().split('T')[0];
      }
      
      // Obtener datos diarios
      const id_empresa_num = id_empresa ? parseInt(id_empresa) : 1;
      const ingresosDiarios = await this.ingresosService.getIngresosDiarios(inicio, fin, id_empresa_num);
      const produccionDiaria = await this.entradasProduccionService.getProduccionDiaria(inicio, fin, id_empresa_num);
      const salidasDiarias = await this.salidasService.getSalidasDiarias(inicio, fin, id_empresa_num);
      const canastasDiarias = await this.salidasService.getCanastasDiarias(inicio, fin, id_empresa_num);
      const gastosDiarios = await this.gastosService.getGastosDiarios(inicio, fin, id_empresa_num);
      
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
      console.error('Error getting datos diarios:', error);
      throw error;
    }
  }
}