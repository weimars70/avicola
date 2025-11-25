import type { Tercero } from './terceros';

export interface DetalleVenta {
    id?: string;
    idVenta?: string;
    descripcion?: string;
    cantidad: number;
    precioUnitario: number;
    canastaId: string;
    inventarioOrigen?: number; // 1 = inventario normal, 2 = inventario terceros
    fechaInserta?: string;
}

export interface Venta {
    id: string;
    fecha: string;
    descripcion?: string;
    total: number;
    idTercero: number;
    idEmpresa: number;
    idUsuarioInserta?: string;
    activo: boolean;
    numeroFactura?: string;
    formaPago?: string;
    observaciones?: string;
    tipoMovimiento: number;
    estado: 'PENDIENTE' | 'PAGADO' | 'PARCIAL';
    createdAt: string;
    updatedAt: string;
    fechaInserta: string;
    fechaActualiza: string;
    tercero?: Tercero;
    detalles?: DetalleVenta[];
}

export interface CreateDetalleVentaDto {
    descripcion?: string | undefined;
    cantidad: number;
    precioUnitario: number;
    canastaId: string;
    inventarioOrigen?: number;
}

export interface CreateVentaDto {
    fecha: string;
    idTercero: number;
    numeroFactura?: string | undefined;
    estado: 'PENDIENTE' | 'PAGADO' | 'PARCIAL';
    formaPago?: string | undefined;
    observaciones?: string | undefined;
    detalles: CreateDetalleVentaDto[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateVentaDto extends Partial<CreateVentaDto> { }

export interface VentasEstadisticas {
    totalVentas: number;
    totalIngresado: number;
    ventasPendientes: number;
    totalPendiente: number;
    ventasPagadas: number;
    totalPagado: number;
    promedioVenta: number;
}
