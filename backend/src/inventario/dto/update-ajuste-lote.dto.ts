import { PartialType } from '@nestjs/mapped-types';
import { CreateAjusteLoteDto } from './create-ajuste-lote.dto';

export class UpdateAjusteLoteDto extends PartialType(CreateAjusteLoteDto) {}