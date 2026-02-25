import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MaestrosService } from './maestros.service';
import { IdEmpresa } from './decorators/empresa.decorator';
import { EmpresaGuard } from './guards/empresa.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('maestros-terceros')
@Controller('maestros-terceros')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, EmpresaGuard)
export class MaestrosController {
  constructor(private readonly maestrosService: MaestrosService) { }

  @Get('ciudades')
  @ApiOperation({ summary: 'Obtener todas las ciudades' })
  findAllCiudades(@Query('activo') activo?: boolean, @Query('id_empresa') idEmpresa?: number) {
    return this.maestrosService.findAllCiudades(activo);
  }

  @Get('estratos')
  @ApiOperation({ summary: 'Obtener todos los estratos' })
  findAllEstratos(@IdEmpresa() id_empresa: number, @Query('activo') activo?: boolean) {
    return this.maestrosService.findAllEstratos(activo, id_empresa);
  }

  @Get('tipos-regimen')
  @ApiOperation({ summary: 'Obtener todos los tipos de régimen' })
  findAllTiposRegimen(@Query('activo') activo?: boolean, @Query('id_empresa') idEmpresa?: number) {
    return this.maestrosService.findAllTiposRegimen(activo);
  }

  @Get('tipos-identificacion')
  @ApiOperation({ summary: 'Obtener todos los tipos de identificación' })
  findAllTiposIdent(@Query('activo') activo?: boolean, @Query('id_empresa') idEmpresa?: number) {
    return this.maestrosService.findAllTiposIdent(activo);
  }

  @Get('tipos-impuesto')
  @ApiOperation({ summary: 'Obtener todos los tipos de impuesto' })
  findAllTiposImpuesto(@Query('activo') activo?: boolean, @Query('id_empresa') idEmpresa?: number) {
    return this.maestrosService.findAllTiposImpuesto(activo);
  }
}
