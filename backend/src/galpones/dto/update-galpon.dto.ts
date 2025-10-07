import { IsString, IsOptional, IsBoolean, IsNumber, Min, MaxLength, IsNotEmpty,  IsUUID } from 'class-validator';

export class UpdateGalponDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  capacidad?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
  
  @IsNotEmpty()
  @IsUUID()
  id_usuario_actualiza?: string;
}