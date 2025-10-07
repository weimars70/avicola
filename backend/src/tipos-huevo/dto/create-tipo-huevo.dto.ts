import { IsString, IsOptional, IsBoolean, IsNumber, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTipoHuevoDto {
  @IsNumber()
  @Type(() => Number)
  id_empresa: number;

  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0)
  valorUnidad: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;
}