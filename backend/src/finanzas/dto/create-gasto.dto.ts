import { IsString, IsNumber, IsDateString, IsOptional, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateGastoDto {
  @IsString()
  descripcion: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Transform(({ value }) => parseFloat(value))
  monto: number;

  @IsDateString()
  fecha: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsString()
  numeroFactura?: string;

  @IsOptional()
  @IsString()
  proveedor?: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  categoriaId: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}