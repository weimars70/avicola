import { TipoHuevo } from '../../tipos-huevo/entities/tipo-huevo.entity';
export declare class Inventario {
    id: number;
    tipoHuevoId: string;
    unidades: number;
    createdAt: Date;
    updatedAt: Date;
    tipoHuevo: TipoHuevo;
}
