export declare class InventarioTerceros {
    id: number;
    idEmpresa: number;
    idTercero: number;
    tipoHuevoCodigo: string;
    cantidad: number;
    tipoMovimiento: string;
    precioUnitario: number;
    valorTotal: number;
    idMovimientoFinanciero?: number;
    idCompra?: number;
    idVenta?: number;
    lote?: string;
    fechaMovimiento: Date;
    concepto?: string;
    descripcion?: string;
    stockAnterior: number;
    stockActual: number;
    activo: boolean;
    createdAt: Date;
    updatedAt: Date;
}
