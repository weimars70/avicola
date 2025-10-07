import { IsString, IsOptional, IsBoolean, IsNumber, IsInt, MaxLength, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCanastaDto {
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
  valorCanasta: number;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  unidadesPorCanasta: number;

  @IsUUID()
  tipoHuevoId: string;

  @IsInt()
  @Type(() => Number)
  id_empresa: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;
}