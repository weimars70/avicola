import { TipoHuevo } from '../../tipos-huevo/entities/tipo-huevo.entity';
import { Canasta } from '../../canastas/entities/canasta.entity';
export declare class Salida {
    id: string;
    tipoHuevoId: string;
    canastaId: string;
    nombreComprador: string;
    unidades: number;
    valor?: number;
    fecha?: string;
    activo: boolean;
    id_empresa: number;
    createdAt: Date;
    updatedAt: Date;
    tipoHuevo: TipoHuevo;
    canasta: Canasta;
}
