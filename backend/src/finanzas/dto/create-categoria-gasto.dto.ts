import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCategoriaGastoDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}