import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateDetalleCompraDto {
    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsNotEmpty()
    @IsNumber()
    cantidad: number;

    @IsNotEmpty()
    @IsNumber()
    precioUnitario: number;

    @IsOptional()
    @IsString()
    tipoHuevoId?: string;

    @IsOptional()
    @IsString()
    canastaId?: string;
}
