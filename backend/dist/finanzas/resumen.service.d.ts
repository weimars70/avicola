import { GastosService } from './gastos.service';
import { SalidasService } from '../salidas/salidas.service';
import { IngresosService } from './ingresos.service';
export declare class ResumenService {
    private readonly gastosService;
    private readonly salidasService;
    private readonly ingresosService;
    constructor(gastosService: GastosService, salidasService: SalidasService, ingresosService: IngresosService);
    getResumenFinanciero(): Promise<{
        totalGastos: number;
        totalGastosOperativos: number;
        totalInversionInicial: number;
        totalIngresos: number;
        utilidadOperativa: number;
        utilidadNeta: number;
        recuperacionInversion: number;
        gastos: import("./entities/gasto.entity").Gasto[];
        salidas: import("../salidas/entities/salida.entity").Salida[];
    }>;
}
