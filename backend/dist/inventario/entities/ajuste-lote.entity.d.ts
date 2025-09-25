import { User } from '../../users/entities/user.entity';
import { AjusteInventario } from './ajuste-inventario.entity';
export declare class AjusteLote {
    id: string;
    descripcionGeneral: string;
    usuarioId: string;
    createdAt: Date;
    usuario: User;
    ajustes: AjusteInventario[];
}
