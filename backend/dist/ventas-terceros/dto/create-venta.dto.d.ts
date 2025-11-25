import { CreateDetalleVentaDto } from './create-detalle-venta.dto';
export declare class CreateVentaDto {
    fecha: string;
    idTercero: number;
    numeroFactura?: string;
    estado: string;
    formaPago?: string;
    observaciones?: string;
    detalles: CreateDetalleVentaDto[];
}
