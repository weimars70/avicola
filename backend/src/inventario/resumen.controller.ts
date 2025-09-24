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
  ) {
    return this.resumenService.getInventarioResumen(galponId, tipoHuevoId);
  }
}