import { Tercero } from '../../terceros/entities/tercero.entity';
import { DetalleCompra } from './detalle-compra.entity';
export declare class Compra {
    id: string;
    fecha: string;
    descripcion: string;
    total: number;
    idTercero: number;
    idEmpresa: number;
    idUsuarioInserta: string;
    activo: boolean;
    numeroFactura: string;
    tipoMovimiento: number;
    createdAt: Date;
    updatedAt: Date;
    tercero: Tercero;
    detalles: DetalleCompra[];
}
