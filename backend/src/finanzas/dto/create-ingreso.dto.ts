import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateIngresoDto {
  @IsNotEmpty()
  @IsNumber({}, { message: 'El monto debe ser un número válido' })
  @Transform(({ value }) => parseFloat(value))
  monto: number;

  @IsNotEmpty()
  @IsDateString({}, { message: 'La fecha debe ser una fecha válida' })
  fecha: string;

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsString()
  referencia?: string;

  @IsOptional()
  @IsString()
  @IsIn(['venta', 'otro'], { message: 'El tipo debe ser "venta" o "otro"' })
  tipo?: string = 'venta';

  @IsOptional()
  @IsString()
  salidaId?: string;
}