import { PartialType } from '@nestjs/mapped-types';
import { CreateDetalleGalponDto } from './create-detalle-galpon.dto';

export class UpdateDetalleGalponDto extends PartialType(CreateDetalleGalponDto) { }
