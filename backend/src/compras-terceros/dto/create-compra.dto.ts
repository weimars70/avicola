import { IsNotEmpty, IsNumber, IsString, IsOptional, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDetalleCompraDto } from './create-detalle-compra.dto';

export class CreateCompraDto {
    @IsNotEmpty()
    @IsString()
    fecha: string;

    @IsNotEmpty()
    @IsNumber()
    idTercero: number;

    @IsOptional()
    @IsString()
    numeroFactura?: string;

    @IsOptional()
    @IsEnum(['PENDIENTE', 'PAGADO', 'PARCIAL'])
    estado?: string;

    @IsOptional()
    @IsString()
    formaPago?: string;

    @IsOptional()
    @IsString()
    observaciones?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateDetalleCompraDto)
    detalles: CreateDetalleCompraDto[];
}
