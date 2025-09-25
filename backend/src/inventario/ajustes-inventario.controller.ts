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
} from '@nestjs/common';
import { AjustesInventarioService } from './ajustes-inventario.service';
import { CreateAjusteInventarioDto } from './dto/create-ajuste-inventario.dto';
import { CreateAjusteLoteDto } from './dto/create-ajuste-lote.dto';
import { UpdateAjusteLoteDto } from './dto/update-ajuste-lote.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ajustes-inventario')
// @UseGuards(JwtAuthGuard)
export class AjustesInventarioController {
  constructor(private readonly ajustesInventarioService: AjustesInventarioService) {}

  @Post()
  create(@Body() createAjusteDto: CreateAjusteInventarioDto) {
    return this.ajustesInventarioService.create(createAjusteDto);
  }

  @Get()
  findAll() {
    return this.ajustesInventarioService.findAll();
  }

  @Get('tipo-huevo/:tipoHuevoId')
  findByTipoHuevo(
    @Param('tipoHuevoId', ParseUUIDPipe) tipoHuevoId: string,
  ) {
    return this.ajustesInventarioService.findByTipoHuevo(tipoHuevoId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ajustesInventarioService.findOne(id);
  }

  @Post('lotes')
  createLote(@Body() createAjusteLoteDto: CreateAjusteLoteDto) {
    return this.ajustesInventarioService.createLote(createAjusteLoteDto);
  }

  @Get('lotes/all')
  findAllLotes() {
    return this.ajustesInventarioService.findAllLotes();
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