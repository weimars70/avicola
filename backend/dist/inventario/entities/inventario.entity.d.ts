import { TipoHuevo } from '../../tipos-huevo/entities/tipo-huevo.entity';
import { User } from '../../users/entities/user.entity';
export declare class Inventario {
    id: number;
    id_empresa: number;
    tipoHuevoId: string;
    unidades: number;
    id_usuario_inserta: string;
    id_usuario_actualiza: string;
    createdAt: Date;
    updatedAt: Date;
    tipoHuevo: TipoHuevo;
    usuarioInserta: User;
    usuarioActualiza: User;
}
