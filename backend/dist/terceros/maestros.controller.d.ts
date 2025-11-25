import { MaestrosService } from './maestros.service';
export declare class MaestrosController {
    private readonly maestrosService;
    constructor(maestrosService: MaestrosService);
    findAllCiudades(activo?: boolean, idEmpresa?: number): Promise<import("./entities/ciudad.entity").Ciudad[]>;
    findAllEstratos(id_empresa: number, activo?: boolean): Promise<{
        codigo: number;
        nombre: string;
        idEmpresa: number;
    }[]>;
    findAllTiposRegimen(activo?: boolean, idEmpresa?: number): Promise<import("./entities/tipo-regimen.entity").TipoRegimen[]>;
    findAllTiposIdent(activo?: boolean, idEmpresa?: number): Promise<import("./entities/tipo-ident.entity").TipoIdent[]>;
    findAllTiposImpuesto(activo?: boolean, idEmpresa?: number): Promise<import("./entities/tipo-impuesto.entity").TipoImpuesto[]>;
}
