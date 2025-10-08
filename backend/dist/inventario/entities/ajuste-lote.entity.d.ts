import { User } from '../../users/entities/user.entity';
import { AjusteInventario } from './ajuste-inventario.entity';
export declare class AjusteLote {
    id: string;
    descripcionGeneral: string;
    usuarioId: string;
    id_empresa: number;
    id_usuario_inserta: string;
    id_usuario_actualiza: string;
    createdAt: Date;
    updatedAt: Date;
    usuario: User;
    ajustes: AjusteInventario[];
    usuarioInserta: User;
    usuarioActualiza: User;
}
