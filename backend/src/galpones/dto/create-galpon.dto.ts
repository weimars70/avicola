import { IsString, IsOptional, IsBoolean, IsNumber, MaxLength, Min, IsNotEmpty, IsInt, IsUUID } from 'class-validator';

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
  
  @IsNotEmpty()
  @IsInt()
  id_empresa: number;
  
  @IsNotEmpty()
  @IsUUID()
  id_usuario_inserta: string;

  @IsOptional()
  @IsUUID()
  id_usuario_actualiza?: string;
}