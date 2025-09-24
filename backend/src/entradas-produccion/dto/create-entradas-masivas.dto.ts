import { IsString, IsDateString, IsArray, ValidateNested, IsNumber, Min } from 'class-validator';
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
}