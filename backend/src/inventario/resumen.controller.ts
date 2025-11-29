import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ResumenService } from './resumen.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IdEmpresaHeader } from '../terceros/decorators/empresa.decorator';

@Controller('inventario')
@UseGuards(JwtAuthGuard)
export class ResumenController {
  constructor(private readonly resumenService: ResumenService) {}

  @Get('resumen')
  getResumen(
    @IdEmpresaHeader() id_empresa_num: number,
    @Query('galponId') galponId?: string,
    @Query('tipoHuevoId') tipoHuevoId?: string,
  ) {
    return this.resumenService.getInventarioResumen(galponId, tipoHuevoId, id_empresa_num);
  }

  @Get('terceros-resumen')
  getResumenTerceros(
    @IdEmpresaHeader() id_empresa_num: number,
    @Query('terceroId') terceroId?: string,
  ) {
    const id_tercero_num = terceroId ? parseInt(terceroId) : undefined;
    return this.resumenService.getInventarioTercerosResumen(id_empresa_num, id_tercero_num);
  }
}
