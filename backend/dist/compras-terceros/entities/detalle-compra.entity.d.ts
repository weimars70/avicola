import { Compra } from './compra.entity';
import { TipoHuevo } from '../../tipos-huevo/entities/tipo-huevo.entity';
import { Canasta } from '../../canastas/entities/canasta.entity';
export declare class DetalleCompra {
    id: string;
    idCompra: string;
    idProducto: string;
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    tipoHuevoId: string;
    canastaId: string;
    tipoMovimiento: number;
    compra: Compra;
    tipoHuevo: TipoHuevo;
    canasta: Canasta;
}
