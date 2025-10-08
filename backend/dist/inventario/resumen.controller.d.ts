import { ResumenService } from './resumen.service';
export declare class ResumenController {
    private readonly resumenService;
    constructor(resumenService: ResumenService);
    getResumen(galponId?: string, tipoHuevoId?: string, id_empresa?: string): Promise<any[]>;
}
