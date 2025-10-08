import { Galpon } from '../../galpones/entities/galpon.entity';
import { TipoHuevo } from '../../tipos-huevo/entities/tipo-huevo.entity';
import { User } from '../../users/entities/user.entity';
export declare class EntradaProduccion {
    id: string;
    galponId: string;
    fecha: Date;
    tipoHuevoId: string;
    unidades: number;
    id_empresa: number;
    id_usuario_inserta: string;
    id_usuario_actualiza: string;
    createdAt: Date;
    updatedAt: Date;
    galpon: Galpon;
    tipoHuevo: TipoHuevo;
    usuarioInserta: User;
    usuarioActualiza: User;
}
