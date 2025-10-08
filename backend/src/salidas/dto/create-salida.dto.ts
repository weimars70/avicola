import { IsNotEmpty, IsString, IsInt, Min, IsDateString, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSalidaDto {
  @IsNotEmpty()
  @IsString()
  tipoHuevoId: string;

  @IsOptional()
  @IsString()
  canastaId?: string | null;

  @IsString()
  @IsOptional()
  nombreComprador?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  unidades: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  valor?: number;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id_empresa?: number;
  
  @IsOptional()
  @IsUUID()
  id_usuario_inserta?: string;
  
  @IsOptional()
  @IsUUID()
  id_usuario_actualiza?: string;
}