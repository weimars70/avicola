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
export declare class ActividadesService {
    private readonly gastosService;
    private readonly salidasService;
    private readonly entradasProduccionService;
    constructor(gastosService: GastosService, salidasService: SalidasService, entradasProduccionService: EntradasProduccionService);
    getActividades(id_empresa: number): Promise<ActividadReciente[]>;
}
