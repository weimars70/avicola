import { Controller, Get, Query, UseGuards, ParseIntPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ActividadesService } from './actividades.service';
import { IdEmpresa } from '../terceros/decorators/empresa.decorator';

@Controller('actividades')
@UseGuards(JwtAuthGuard)
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) { }

  @Get('recientes')
  async getActividadesRecientes(
    @IdEmpresa() id_empresa: number,
    @Query('limit') limit?: string
  ) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.actividadesService.getActividades(id_empresa);
  }
}