import { IsString, IsNumber, IsDateString, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ConsumoHuevoDto {
  @IsString()
  tipoHuevoId: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  unidades: number;
}

export class CreateConsumoPropioDto {
  @IsString()
  descripcion: string;

  @IsDateString()
  fecha: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConsumoHuevoDto)
  huevosConsumidos: ConsumoHuevoDto[];

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}