import { IsString, IsNumber, IsDateString, IsOptional, IsBoolean, IsArray, ValidateNested, IsInt, IsUUID } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ConsumoHuevoDto {
  @IsString()
  tipoHuevoId: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  unidades: number;
}

export class CreateConsumoPropioDto {
  @IsString()
  descripcion: string;

  @IsDateString()
  fecha: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConsumoHuevoDto)
  huevosConsumidos: ConsumoHuevoDto[];

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
  
  // ⬅️ OPCIONAL en DTO porque viene por query param
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  id_empresa?: number;
  
  // ⬅️ OPCIONAL en DTO, cambiado a UUID
  @IsOptional()
  @IsUUID()
  id_usuario_inserta?: string; // ⬅️ STRING (UUID)
}