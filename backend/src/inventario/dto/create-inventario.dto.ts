import { IsString, IsInt, Min, IsUUID } from 'class-validator';

export class CreateInventarioDto {
  @IsUUID()
  tipoHuevoId: string;

  @IsInt()
  @Min(0)
  unidades: number;
}