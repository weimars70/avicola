import { IsNotEmpty, IsNumber, IsString, IsOptional, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDetalleVentaDto } from './create-detalle-venta.dto';

export class CreateVentaDto {
    @IsNotEmpty()
    @IsString()
    fecha: string;

    @IsNotEmpty()
    @IsNumber()
    idTercero: number;

    @IsOptional()
    @IsString()
    numeroFactura?: string;

    @IsNotEmpty()
    @IsEnum(['PENDIENTE', 'PAGADO', 'PARCIAL'])
    estado: string;

    @IsOptional()
    @IsString()
    formaPago?: string;

    @IsOptional()
    @IsString()
    observaciones?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateDetalleVentaDto)
    detalles: CreateDetalleVentaDto[];
}
