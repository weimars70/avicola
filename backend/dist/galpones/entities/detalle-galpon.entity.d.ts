import { Galpon } from './galpon.entity';
import { User } from '../../users/entities/user.entity';
export declare enum TipoMovimiento {
    SUMA = "SUMA",
    RESTA = "RESTA"
}
export declare class DetalleGalpon {
    id: string;
    id_galpon: string;
    tipo: TipoMovimiento;
    cantidad: number;
    motivo: string;
    comentario: string;
    fecha: Date;
    id_empresa: number;
    id_usuario_inserta: string;
    id_usuario_actualiza: string;
    createdAt: Date;
    updatedAt: Date;
    galpon: Galpon;
    usuarioInserta: User;
    usuarioActualiza: User;
}
