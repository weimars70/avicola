import { TipoHuevo } from '../../tipos-huevo/entities/tipo-huevo.entity';
export declare class Canasta {
    id: string;
    nombre: string;
    descripcion: string;
    valorCanasta: number;
    unidadesPorCanasta: number;
    tipoHuevo: TipoHuevo;
    tipoHuevoId: string;
    id_empresa: number;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
}
