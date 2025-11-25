import { CategoriaGasto } from './categoria-gasto.entity';
export declare class Gasto {
    id: string;
    descripcion: string;
    monto: number;
    fecha: Date;
    observaciones: string;
    numeroFactura: string;
    proveedor: string;
    activo: boolean;
    categoria: CategoriaGasto;
    categoriaId: number;
    id_empresa: number;
    id_usuario_inserta: string;
    createdAt: Date;
    updatedAt: Date;
}
