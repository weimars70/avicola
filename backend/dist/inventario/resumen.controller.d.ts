import { ResumenService } from './resumen.service';
export declare class ResumenController {
    private readonly resumenService;
    constructor(resumenService: ResumenService);
    getResumen(id_empresa_num: number, galponId?: string, tipoHuevoId?: string): Promise<any[]>;
    getResumenTerceros(id_empresa_num: number, terceroId?: string): Promise<{
        canasta: import("../canastas/entities/canasta.entity").Canasta | {
            id: any;
            nombre: string;
            unidadesPorCanasta: number;
        };
        stockActual: number;
    }[]>;
}
