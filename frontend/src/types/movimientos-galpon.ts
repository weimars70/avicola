export enum TipoMovimiento {
    SUMA = 'SUMA',
    RESTA = 'RESTA'
}

export interface DetalleGalpon {
    id: string;
    id_galpon: string;
    tipo: TipoMovimiento;
    cantidad: number;
    motivo: string;
    comentario: string;
    fecha: string;
    id_empresa: number;
    id_usuario_inserta: string;
    id_usuario_actualiza?: string;
    createdAt: string;
    updatedAt: string;
    usuarioInserta?: {
        id: string;
        nombre: string;
        email: string;
    };
    usuarioActualiza?: {
        id: string;
        nombre: string;
        email: string;
    };
}

export interface CreateDetalleGalponDto {
    id_galpon: string;
    tipo: TipoMovimiento;
    cantidad: number;
    motivo: string;
    comentario?: string;
    fecha?: string | Date;
}

export type UpdateDetalleGalponDto = Partial<CreateDetalleGalponDto>;

