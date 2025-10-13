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
import { IdEmpresaHeader } from '../terceros/decorators/empresa.decorator';

@Controller('inventario-stock')
@UseGuards(JwtAuthGuard)
export class InventarioStockController {
  constructor(private readonly inventarioStockService: InventarioStockService) {}

  @Post()
  create(@Body() createInventarioDto: CreateInventarioDto) {
    return this.inventarioStockService.create(createInventarioDto);
  }

  @Get()
  findAll(@IdEmpresaHeader() id_empresa: number) {
    return this.inventarioStockService.findAll(id_empresa);
  }

  @Get('vista/inventario')
  getVistaInventario(@IdEmpresaHeader() id_empresa: number) {
    return this.inventarioStockService.getVistaInventario(id_empresa);
  }

  @Get('tipo-huevo/:tipoHuevoId')
  findByTipoHuevo(
    @Param('tipoHuevoId', ParseUUIDPipe) tipoHuevoId: string,
    @IdEmpresaHeader() id_empresa: number,
  ) {
    return this.inventarioStockService.findByTipoHuevo(tipoHuevoId, id_empresa);
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