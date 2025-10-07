import { IsNotEmpty, IsString, IsInt, IsDateString, Min } from 'class-validator';

export class CreateEntradaProduccionDto {
  @IsNotEmpty()
  @IsString()
  galponId: string;

  @IsNotEmpty()
  @IsDateString()
  fecha: string;

  @IsNotEmpty()
  @IsString()
  tipoHuevoId: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  unidades: number;
  
  @IsNotEmpty()
  @IsInt()
  id_empresa: number;
}