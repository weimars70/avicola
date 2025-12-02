import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SalidasService } from './salidas.service';
import { CreateSalidaDto } from './dto/create-salida.dto';
import { UpdateSalidaDto } from './dto/update-salida.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IdEmpresaHeader } from '../terceros/decorators/empresa.decorator';

@Controller('salidas')
@UseGuards(JwtAuthGuard)
export class SalidasController {
  constructor(private readonly salidasService: SalidasService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(
    @Body() createSalidaDto: CreateSalidaDto,
    @IdEmpresaHeader() id_empresa: number,
  ) {
    // Aseguramos que id_empresa del DTO coincida con el header
    createSalidaDto.id_empresa = id_empresa;
    return this.salidasService.create(createSalidaDto, id_empresa);
  }

  @Get()
  findAll(@IdEmpresaHeader() id_empresa: number) {
    return this.salidasService.findAll(id_empresa);
  }

  @Get('resumen-canastas')
  getResumenCanastas(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @IdEmpresaHeader() id_empresa: number
  ) {
    return this.salidasService.getResumenCanastas(fechaInicio, fechaFin, id_empresa);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @IdEmpresaHeader() id_empresa: number
  ) {
    return this.salidasService.findOne(id, id_empresa);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id') id: string,
    @Body() updateSalidaDto: UpdateSalidaDto,
    @IdEmpresaHeader() id_empresa: number,
  ) {
    return this.salidasService.update(id, updateSalidaDto, id_empresa);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @IdEmpresaHeader() id_empresa: number
  ) {
    return this.salidasService.remove(id, id_empresa);
  }
}