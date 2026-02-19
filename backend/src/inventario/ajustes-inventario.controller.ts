import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { AjustesInventarioService } from './ajustes-inventario.service';
import { CreateAjusteInventarioDto } from './dto/create-ajuste-inventario.dto';
import { CreateAjusteLoteDto } from './dto/create-ajuste-lote.dto';
import { UpdateAjusteLoteDto } from './dto/update-ajuste-lote.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IdEmpresa } from '../terceros/decorators/empresa.decorator';

@Controller('ajustes-inventario')
@UseGuards(JwtAuthGuard)
export class AjustesInventarioController {
  constructor(private readonly ajustesInventarioService: AjustesInventarioService) { }

  @Post()
  create(
    @Body() createAjusteDto: CreateAjusteInventarioDto,
    @IdEmpresa() id_empresa: number
  ) {
    return this.ajustesInventarioService.create(createAjusteDto, id_empresa);
  }

  @Get()
  findAll(@IdEmpresa() id_empresa: number) {
    return this.ajustesInventarioService.findAll(id_empresa);
  }

  @Get('tipo-huevo/:tipoHuevoId')
  findByTipoHuevo(
    @Param('tipoHuevoId', ParseUUIDPipe) tipoHuevoId: string,
    @IdEmpresa() id_empresa: number,
  ) {
    return this.ajustesInventarioService.findByTipoHuevo(tipoHuevoId, id_empresa);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ajustesInventarioService.findOne(id);
  }

  @Post('lotes')
  createLote(
    @Body() createAjusteLoteDto: CreateAjusteLoteDto,
    @IdEmpresa() id_empresa: number
  ) {
    return this.ajustesInventarioService.createLote(createAjusteLoteDto, id_empresa);
  }

  @Get('lotes/all')
  findAllLotes(@IdEmpresa() id_empresa: number) {
    return this.ajustesInventarioService.findAllLotes(id_empresa);
  }

  @Get('lotes/:id')
  findOneLote(@Param('id', ParseUUIDPipe) id: string) {
    return this.ajustesInventarioService.findOneLote(id);
  }

  @Put('lotes/:id')
  updateLote(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAjusteLoteDto: UpdateAjusteLoteDto,
  ) {
    return this.ajustesInventarioService.updateLote(id, updateAjusteLoteDto);
  }

  @Delete('lotes/:id')
  removeLote(@Param('id', ParseUUIDPipe) id: string) {
    return this.ajustesInventarioService.removeLote(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAjusteDto: CreateAjusteInventarioDto,
  ) {
    return this.ajustesInventarioService.update(id, updateAjusteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ajustesInventarioService.remove(id);
  }
}