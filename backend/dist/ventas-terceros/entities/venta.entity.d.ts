import { Tercero } from '../../terceros/entities/tercero.entity';
import { DetalleVenta } from './detalle-venta.entity';
export declare class Venta {
    id: string;
    fecha: string;
    descripcion: string;
    total: number;
    idTercero: number;
    idEmpresa: number;
    idUsuarioInserta: string;
    activo: boolean;
    numeroFactura: string;
    formaPago: string;
    observaciones: string;
    tipoMovimiento: number;
    estado: string;
    createdAt: Date;
    updatedAt: Date;
    fechaInserta: Date;
    fechaActualiza: Date;
    tercero: Tercero;
    detalles: DetalleVenta[];
}
