import { IsString, IsNumber, IsDateString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
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
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  id_empresa?: number;
  
  @IsOptional()
  @IsString()
  id_usuario_inserta?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}