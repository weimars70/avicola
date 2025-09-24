import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActividadesService, ActividadReciente } from './actividades.service';

@Controller('actividades')
@UseGuards(JwtAuthGuard)
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  @Get('recientes')
  async getActividadesRecientes(
    @Query('limit') limit?: string,
  ): Promise<ActividadReciente[]> {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.actividadesService.getActividadesRecientes(limitNumber);
  }
}