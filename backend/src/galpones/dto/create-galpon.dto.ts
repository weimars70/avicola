import { IsString, IsOptional, IsBoolean, IsNumber, MaxLength, Min } from 'class-validator';

export class CreateGalponDto {
  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @IsNumber()
  @Min(1)
  capacidad: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;
}