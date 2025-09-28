import { IsNotEmpty, IsString, IsInt, Min, IsDateString, IsOptional, IsNumber } from 'class-validator';

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
}