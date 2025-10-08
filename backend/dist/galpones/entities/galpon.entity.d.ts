import { User } from '../../users/entities/user.entity';
export declare class Galpon {
    id: string;
    nombre: string;
    descripcion: string;
    capacidad: number;
    activo: boolean;
    id_empresa: number;
    id_usuario_inserta: string;
    id_usuario_actualiza: string;
    createdAt: Date;
    updatedAt: Date;
    usuarioInserta: User;
    usuarioActualiza: User;
}
