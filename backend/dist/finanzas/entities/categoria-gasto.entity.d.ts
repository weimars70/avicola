import { Gasto } from './gasto.entity';
export declare class CategoriaGasto {
    id: number;
    nombre: string;
    descripcion: string;
    color: string;
    activo: boolean;
    gastos: Gasto[];
    createdAt: Date;
    updatedAt: Date;
}
