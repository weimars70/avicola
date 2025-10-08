import { Salida } from '../../salidas/entities/salida.entity';
export declare class Ingreso {
    id: string;
    monto: number;
    fecha: string;
    descripcion: string;
    observaciones?: string;
    tipo: string;
    referencia?: string;
    activo: boolean;
    id_empresa: number;
    id_usuario_inserta: string;
    salidaId?: string;
    salida?: Salida;
    createdAt: Date;
    updatedAt: Date;
}
