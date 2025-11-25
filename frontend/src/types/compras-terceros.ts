import type { Tercero } from './terceros';

export interface DetalleCompra {
    id?: string;
    idCompra?: string;
    descripcion?: string;
    cantidad: number;
    precioUnitario: number;
    tipoHuevoId?: string;
    canastaId?: string;
    tipoMovimiento?: number;
    fechaInserta?: string;
}

export interface Compra {
    id: string;
    fecha: string;
    descripcion?: string;
    total: number;
    idTercero: number;
    idEmpresa: number;
    idUsuarioInserta?: string;
    activo: boolean;
    numeroFactura?: string;
    tipoMovimiento: number;
    estado: 'PENDIENTE' | 'PAGADO' | 'PARCIAL';
    formaPago?: string;
    observaciones?: string;
    createdAt: string;
    updatedAt: string;
    tercero?: Tercero;
    detalles?: DetalleCompra[];
}

export interface CreateDetalleCompraDto {
    descripcion?: string | undefined;
    cantidad: number;
    precioUnitario: number;
    tipoHuevoId?: string;
    canastaId?: string;
}

export interface CreateCompraDto {
    fecha: string;
    idTercero: number;
    numeroFactura?: string | undefined;
    estado?: 'PENDIENTE' | 'PAGADO' | 'PARCIAL' | undefined;
    formaPago?: string | undefined;
    observaciones?: string | undefined;
    detalles: CreateDetalleCompraDto[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateCompraDto extends Partial<CreateCompraDto> { }

export interface ComprasEstadisticas {
    totalCompras: number;
    totalGastado: number;
    comprasPendientes: number;
    totalPendiente: number;
    promedioCompra: number;
}
