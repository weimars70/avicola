import { PartialType } from '@nestjs/mapped-types';
import { CreateIngresoDto } from './create-ingreso.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateIngresoDto extends PartialType(CreateIngresoDto) {
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}