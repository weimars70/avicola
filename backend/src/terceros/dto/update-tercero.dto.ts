import { PartialType } from '@nestjs/swagger';
import { CreateTerceroDto } from './create-tercero.dto';

export class UpdateTerceroDto extends PartialType(CreateTerceroDto) {}