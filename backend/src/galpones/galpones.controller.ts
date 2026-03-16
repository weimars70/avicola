import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Logger,
} from '@nestjs/common';
import { GalponesService } from './galpones.service';
import { CreateGalponDto } from './dto/create-galpon.dto';
import { UpdateGalponDto } from './dto/update-galpon.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IdEmpresa } from '../terceros/decorators/empresa.decorator';

@Controller('galpones')
@UseGuards(JwtAuthGuard)
export class GalponesController {
  private readonly logger = new Logger(GalponesController.name);

  constructor(private readonly galponesService: GalponesService) { }

  @Post()
  async create(
    @Body() createGalponDto: CreateGalponDto,
    @IdEmpresa() id_empresa: number,
  ) {
    createGalponDto.id_empresa = id_empresa;
    try {
      return await this.galponesService.create(createGalponDto);
    } catch (error) {
      this.logger.error('Error al crear galpón:', error.message);
      throw error;
    }
  }

  @Get()
  findAll(@IdEmpresa() id_empresa: number) {
    return this.galponesService.findAll(id_empresa);
  }

  @Get('all')
  findAllIncludingInactive(@IdEmpresa() id_empresa: number) {
    return this.galponesService.findAllIncludingInactive(id_empresa);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @IdEmpresa() id_empresa: number) {
    return this.galponesService.findOne(id, id_empresa);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGalponDto: UpdateGalponDto,
    @IdEmpresa() id_empresa: number,
  ) {
    this.logger.log('=== INICIO ACTUALIZACIÓN GALPÓN ===');
    this.logger.log('ID recibido en controlador:', id);
    this.logger.log('DTO recibido en controlador:', JSON.stringify(updateGalponDto));

    try {
      const resultado = await this.galponesService.update(id, updateGalponDto, id_empresa);
      this.logger.log('Galpón actualizado exitosamente:', JSON.stringify(resultado));
      this.logger.log('=== FIN ACTUALIZACIÓN GALPÓN (ÉXITO) ===');
      return resultado;
    } catch (error) {
      this.logger.error('Error al actualizar galpón:', error.message);
      this.logger.error('Stack trace:', error.stack);
      this.logger.log('=== FIN ACTUALIZACIÓN GALPÓN (ERROR) ===');
      throw error;
    }
  }

  @Patch(':id/inactivar')
  async inactivate(@Param('id', ParseUUIDPipe) id: string, @IdEmpresa() id_empresa: number) {
    this.logger.log('=== INICIO INACTIVACIÓN GALPÓN ===');
    this.logger.log('ID recibido:', id);

    try {
      await this.galponesService.remove(id, id_empresa);
      this.logger.log('Galpón inactivado exitosamente');
      this.logger.log('=== FIN INACTIVACIÓN GALPÓN (ÉXITO) ===');
      return { message: 'Galpón inactivado exitosamente' };
    } catch (error) {
      this.logger.error('Error al inactivar galpón:', error.message);
      this.logger.error('Stack trace:', error.stack);
      this.logger.log('=== FIN INACTIVACIÓN GALPÓN (ERROR) ===');
      throw error;
    }
  }

  @Patch(':id/reactivar')
  async reactivate(@Param('id', ParseUUIDPipe) id: string, @IdEmpresa() id_empresa: number) {
    this.logger.log('=== INICIO REACTIVACIÓN GALPÓN ===');
    this.logger.log('ID recibido:', id);

    try {
      await this.galponesService.reactivate(id, id_empresa);
      this.logger.log('Galpón reactivado exitosamente');
      this.logger.log('=== FIN REACTIVACIÓN GALPÓN (ÉXITO) ===');
      return { message: 'Galpón reactivado exitosamente' };
    } catch (error) {
      this.logger.error('Error al reactivar galpón:', error.message);
      this.logger.error('Stack trace:', error.stack);
      this.logger.log('=== FIN REACTIVACIÓN GALPÓN (ERROR) ===');
      throw error;
    }
  }
}