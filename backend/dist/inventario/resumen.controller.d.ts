import { ResumenService } from './resumen.service';
export declare class ResumenController {
    private readonly resumenService;
    constructor(resumenService: ResumenService);
    getResumen(id_empresa_num: number, galponId?: string, tipoHuevoId?: string): Promise<any[]>;
}
