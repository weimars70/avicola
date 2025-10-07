import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ResumenService } from './resumen.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('inventario')
@UseGuards(JwtAuthGuard)
export class ResumenController {
  constructor(private readonly resumenService: ResumenService) {}

  @Get('resumen')
  getResumen(
    @Query('galponId') galponId?: string,
    @Query('tipoHuevoId') tipoHuevoId?: string,
    @Query('id_empresa') id_empresa?: string,
  ) {
    if (!id_empresa) {
      throw new Error('No hay empresa asociada al usuario logueado');
    }
    const id_empresa_num = parseInt(id_empresa);
    return this.resumenService.getInventarioResumen(galponId, tipoHuevoId, id_empresa_num);
  }
}