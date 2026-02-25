import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { TipoMovimiento } from '../entities/detalle-galpon.entity';

export class CreateDetalleGalponDto {
    @IsUUID()
    @IsNotEmpty()
    id_galpon: string;

    @IsEnum(TipoMovimiento)
    @IsNotEmpty()
    tipo: TipoMovimiento;

    @IsInt()
    @Min(1)
    @IsNotEmpty()
    cantidad: number;

    @IsString()
    @IsNotEmpty()
    motivo: string;

    @IsString()
    @IsOptional()
    comentario?: string;

    @IsOptional()
    fecha?: Date;
}
