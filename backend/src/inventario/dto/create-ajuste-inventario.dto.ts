import { IsString, IsInt, IsEnum, IsNotEmpty, Min } from 'class-validator';

export class CreateAjusteInventarioDto {
  @IsString()
  @IsNotEmpty()
  tipoHuevoId: string;

  @IsInt()
  @Min(1)
  cantidadAjuste: number;

  @IsEnum(['suma', 'resta'])
  tipoAjuste: 'suma' | 'resta';

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsString()
  @IsNotEmpty()
  usuarioId: string;
}