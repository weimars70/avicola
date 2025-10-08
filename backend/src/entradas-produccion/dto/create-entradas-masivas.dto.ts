import { IsString, IsDateString, IsArray, ValidateNested, IsNumber, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class EntradaProduccionItem {
  @IsString()
  tipoHuevoId: string;

  @IsNumber()
  @Min(0)
  unidades: number;
}

export class CreateEntradasMasivasDto {
  @IsString()
  galponId: string;

  @IsDateString()
  fecha: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EntradaProduccionItem)
  entradas: EntradaProduccionItem[];
  
  @IsNumber()
  @IsOptional()
  id_empresa?: number;
  
  @IsString()
  @IsOptional()
  id_usuario_inserta?: string;
}