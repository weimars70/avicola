import { PartialType } from '@nestjs/mapped-types';
import { CreateEntradaProduccionDto } from './create-entrada-produccion.dto';

export class UpdateEntradaProduccionDto extends PartialType(CreateEntradaProduccionDto) {}