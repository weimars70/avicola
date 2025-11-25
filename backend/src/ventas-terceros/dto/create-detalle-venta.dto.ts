import { IsNotEmpty, IsNumber, IsString, IsOptional, IsInt } from 'class-validator';

export class CreateDetalleVentaDto {
    @IsOptional()
    @IsString()
    descripcion?: string;

    @IsNotEmpty()
    @IsNumber()
    cantidad: number;

    @IsNotEmpty()
    @IsNumber()
    precioUnitario: number;

    @IsNotEmpty()
    @IsString()
    canastaId: string;

    @IsOptional()
    @IsInt()
    inventarioOrigen?: number; // 1 = inventario normal, 2 = inventario terceros
}
