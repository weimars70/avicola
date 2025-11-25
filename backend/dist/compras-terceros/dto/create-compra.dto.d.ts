import { CreateDetalleCompraDto } from './create-detalle-compra.dto';
export declare class CreateCompraDto {
    fecha: string;
    idTercero: number;
    numeroFactura?: string;
    estado?: string;
    formaPago?: string;
    observaciones?: string;
    detalles: CreateDetalleCompraDto[];
}
