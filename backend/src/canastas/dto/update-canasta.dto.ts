import { IsString, IsOptional, IsBoolean, IsNumber, IsInt, MaxLength, Min, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateCanastaDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0)
  valorCanasta?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  unidadesPorCanasta?: number;

  @IsOptional()
  @IsUUID()
  tipoHuevoId?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}