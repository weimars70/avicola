import { IsString, IsInt, Min, IsUUID, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInventarioDto {
  @IsNumber()
  @Type(() => Number)
  id_empresa: number;

  @IsUUID()
  tipoHuevoId: string;

  @IsInt()
  @Min(0)
  unidades: number;
}