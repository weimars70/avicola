import { TipoMovimiento } from '../entities/detalle-galpon.entity';
export declare class CreateDetalleGalponDto {
    id_galpon: string;
    tipo: TipoMovimiento;
    cantidad: number;
    motivo: string;
    comentario?: string;
    fecha?: Date;
}
