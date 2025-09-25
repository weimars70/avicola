import { Galpon } from '../../galpones/entities/galpon.entity';
import { TipoHuevo } from '../../tipos-huevo/entities/tipo-huevo.entity';
export declare class EntradaProduccion {
    id: string;
    galponId: string;
    fecha: Date;
    tipoHuevoId: string;
    unidades: number;
    createdAt: Date;
    updatedAt: Date;
    galpon: Galpon;
    tipoHuevo: TipoHuevo;
}
