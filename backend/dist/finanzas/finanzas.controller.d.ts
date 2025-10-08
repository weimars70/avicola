import { GastosService } from './gastos.service';
import { IngresosService } from './ingresos.service';
import { ResumenService } from './resumen.service';
import { GalponesService } from '../galpones/galpones.service';
import { EntradasProduccionService } from '../entradas-produccion/entradas-produccion.service';
import { SalidasService } from '../salidas/salidas.service';
import { ResumenService as InventarioResumenService } from '../inventario/resumen.service';
export declare class FinanzasController {
    private readonly gastosService;
    private readonly ingresosService;
    private readonly resumenService;
    private readonly galponesService;
    private readonly entradasProduccionService;
    private readonly salidasService;
    private readonly inventarioResumenService;
    constructor(gastosService: GastosService, ingresosService: IngresosService, resumenService: ResumenService, galponesService: GalponesService, entradasProduccionService: EntradasProduccionService, salidasService: SalidasService, inventarioResumenService: InventarioResumenService);
    getResumenFinanciero(fechaInicio?: string, fechaFin?: string, id_empresa?: string): Promise<{
        totalIngresos: number;
        totalGastos: number;
        totalGastosOperativos: number;
        totalInversionInicial: number;
        utilidadOperativa: number;
        utilidadNeta: number;
        margenUtilidad: number;
        recuperacionInversion: number;
        gastosPorCategoria: any[];
        ingresosPorTipo: any[];
        periodo: {
            fechaInicio: string;
            fechaFin: string;
        };
    }>;
    getComparativoMensual(anio?: string, id_empresa?: string): Promise<{
        anio: number;
        totalInversionInicial: number;
        meses: any[];
    }>;
    getKPIsFinancieros(fechaInicio?: string, fechaFin?: string, id_empresa?: string): Promise<{
        promedioGastoDiario: number;
        promedioIngresoDiario: number;
        ratioIngresoGasto: number;
        totalIngresos: number;
        totalGastos: number;
        totalGastosOperativos: number;
        totalInversionInicial: number;
        utilidadOperativa: number;
        utilidadNeta: number;
        margenUtilidad: number;
        recuperacionInversion: number;
        gastosPorCategoria: any[];
        ingresosPorTipo: any[];
        periodo: {
            fechaInicio: string;
            fechaFin: string;
        };
    }>;
    getDashboardKpis(id_empresa?: string): Promise<{
        produccionTotal: number;
        ingresosDelMes: number;
        inventarioActual: any;
        galponesActivos: number;
        totalGalpones: number;
        gallinasTotal: number;
        gallinasActivas: number;
    }>;
    private calcularPromedioGastoDiario;
    private calcularPromedioIngresoDiario;
    setInversionInicial(inversionData: {
        montoTotal: number;
        fechaInicio: string;
        metaRecuperacion?: number;
    }): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/gasto.entity").Gasto;
    }>;
    getDatosDiarios(fechaInicio?: string, fechaFin?: string, id_empresa?: string): Promise<Record<string, any>>;
}
