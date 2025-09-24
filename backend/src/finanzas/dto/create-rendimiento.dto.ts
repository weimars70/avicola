import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  IsIn,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateRendimientoDto {
  @IsNotEmpty()
  @IsDateString()
  fecha: string;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  totalIngresos: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  totalGastos: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Transform(({ value }) => parseFloat(value))
  utilidadNeta: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(-100)
  @Max(1000)
  @Transform(({ value }) => parseFloat(value))
  margenUtilidad: number;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(-100)
  @Max(1000)
  @Transform(({ value }) => parseFloat(value))
  roi: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['diario', 'semanal', 'mensual', 'anual'])
  periodo: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}