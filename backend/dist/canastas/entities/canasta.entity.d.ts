import { TipoHuevo } from '../../tipos-huevo/entities/tipo-huevo.entity';
import { User } from '../../users/entities/user.entity';
export declare class Canasta {
    id: string;
    nombre: string;
    descripcion: string;
    valorCanasta: number;
    unidadesPorCanasta: number;
    tipoHuevo: TipoHuevo;
    tipoHuevoId: string;
    id_empresa: number;
    id_usuario_inserta: string;
    id_usuario_actualiza: string;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
    usuarioInserta: User;
    usuarioActualiza: User;
}
