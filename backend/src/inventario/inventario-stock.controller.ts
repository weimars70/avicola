import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { InventarioStockService } from './inventario-stock.service';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('inventario-stock')
@UseGuards(JwtAuthGuard)
export class InventarioStockController {
  constructor(private readonly inventarioStockService: InventarioStockService) {}

  @Post()
  create(@Body() createInventarioDto: CreateInventarioDto) {
    return this.inventarioStockService.create(createInventarioDto);
  }

  @Get()
  findAll(@Query('tipoHuevoId') tipoHuevoId?: string) {
    if (tipoHuevoId) {
      return this.inventarioStockService.findByTipoHuevo(tipoHuevoId);
    }
    return this.inventarioStockService.findAll();
  }

  @Get('vista/inventario')
  getVistaInventario() {
    return this.inventarioStockService.getVistaInventario();
  }

  @Get('tipo-huevo/:tipoHuevoId')
  findByTipoHuevo(
    @Param('tipoHuevoId', ParseUUIDPipe) tipoHuevoId: string,
  ) {
    return this.inventarioStockService.findByTipoHuevo(tipoHuevoId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioStockService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateInventarioDto: UpdateInventarioDto,
  ) {
    return this.inventarioStockService.update(id, updateInventarioDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inventarioStockService.remove(id);
  }
}