import { IsString, IsArray, ValidateNested, IsNotEmpty, IsInt, IsEnum, Min, IsUUID, IsNumber, IsPositive, IsIn, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateAjusteInventarioDto } from './create-ajuste-inventario.dto';

export class AjusteItemDto {
  @IsUUID()
  @IsNotEmpty()
  tipoHuevoId: string;

  @IsNumber()
  @IsPositive()
  cantidadAjuste: number;

  @IsIn(['suma', 'resta'])
  tipoAjuste: 'suma' | 'resta';

  @IsString()
  @IsOptional()
  descripcion?: string;
}

export class CreateAjusteLoteDto {
  @IsString()
  @IsNotEmpty()
  descripcionGeneral: string;

  @IsString()
  @IsNotEmpty()
  usuarioId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AjusteItemDto)
  ajustes: AjusteItemDto[];
  
  @IsString()
  @IsOptional()
  id_usuario_inserta?: string;
  
  @IsNumber()
  @IsOptional()
  id_empresa?: number;
}