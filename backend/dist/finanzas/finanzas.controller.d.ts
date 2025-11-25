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
    getResumenFinanciero(id_empresa_num: number, fechaInicio?: string, fechaFin?: string, origen?: string): Promise<{
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
        origen: string;
    }>;
    getComparativoMensual(id_empresa_num: number, anio?: string): Promise<{
        anio: number;
        totalInversionInicial: number;
        meses: any[];
    }>;
    getKPIsFinancieros(id_empresa_num: number, fechaInicio?: string, fechaFin?: string): Promise<{
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
        origen: string;
    }>;
    getDashboardKpis(id_empresa_num: number): Promise<{
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
    private getTotalIngresosTerceros;
    private getTotalGastosTerceros;
    setInversionInicial(inversionData: {
        montoTotal: number;
        fechaInicio: string;
        metaRecuperacion?: number;
    }, id_empresa: number, id_usuario_inserta: string): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/gasto.entity").Gasto;
    }>;
    getDatosDiarios(id_empresa_num: number, fechaInicio?: string, fechaFin?: string): Promise<Record<string, any>>;
}
