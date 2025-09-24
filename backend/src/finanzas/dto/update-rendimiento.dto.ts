import { PartialType } from '@nestjs/mapped-types';
import { CreateRendimientoDto } from './create-rendimiento.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateRendimientoDto extends PartialType(CreateRendimientoDto) {
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}