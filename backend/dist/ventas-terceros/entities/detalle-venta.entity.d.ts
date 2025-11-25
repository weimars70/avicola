import { Venta } from './venta.entity';
import { Canasta } from '../../canastas/entities/canasta.entity';
export declare class DetalleVenta {
    id: string;
    idVenta: string;
    idProducto: string;
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    canastaId: string;
    codigo: string;
    fechaInserta: Date;
    inventarioOrigen: number;
    venta: Venta;
    canasta: Canasta;
}
