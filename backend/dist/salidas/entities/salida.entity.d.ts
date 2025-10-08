import { TipoHuevo } from '../../tipos-huevo/entities/tipo-huevo.entity';
import { Canasta } from '../../canastas/entities/canasta.entity';
import { User } from '../../users/entities/user.entity';
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
    id_usuario_inserta: string;
    id_usuario_actualiza: string;
    createdAt: Date;
    updatedAt: Date;
    tipoHuevo: TipoHuevo;
    canasta: Canasta;
    usuarioInserta: User;
    usuarioActualiza: User;
}
