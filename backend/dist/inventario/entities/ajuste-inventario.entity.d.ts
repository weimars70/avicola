import { TipoHuevo } from '../../tipos-huevo/entities/tipo-huevo.entity';
import { User } from '../../users/entities/user.entity';
import { AjusteLote } from './ajuste-lote.entity';
export declare class AjusteInventario {
    id: string;
    tipoHuevoId: string;
    cantidadAnterior: number;
    cantidadAjuste: number;
    cantidadNueva: number;
    tipoAjuste: 'suma' | 'resta';
    descripcion: string;
    usuarioId: string;
    ajusteLoteId: string;
    createdAt: Date;
    tipoHuevo: TipoHuevo;
    usuario: User;
    ajusteLote: AjusteLote;
}
