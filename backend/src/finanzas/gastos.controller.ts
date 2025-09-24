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
  Query,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { GastosService } from './gastos.service';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { CreateConsumoPropioDto } from './dto/create-consumo-propio.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('gastos')
@UseGuards(JwtAuthGuard)
export class GastosController {
  constructor(private readonly gastosService: GastosService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createGastoDto: CreateGastoDto) {
    return this.gastosService.create(createGastoDto);
  }

  @Post('consumo-propio')
  @UsePipes(new ValidationPipe({ transform: true }))
  createConsumoPropio(@Body() createConsumoPropioDto: CreateConsumoPropioDto) {
    return this.gastosService.createConsumoPropio(createConsumoPropioDto);
  }

  @Get()
  findAll() {
    return this.gastosService.findAll();
  }

  @Get('all-including-inactive')
  findAllIncludingInactive() {
    return this.gastosService.findAllIncludingInactive();
  }

  @Get('by-date-range')
  findByDateRange(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.gastosService.findByDateRange(fechaInicio, fechaFin);
  }

  @Get('by-categoria/:categoriaId')
  findByCategoria(@Param('categoriaId') categoriaId: string) {
    return this.gastosService.findByCategoria(parseInt(categoriaId));
  }

  @Get('total')
  getTotalGastos() {
    return this.gastosService.getTotalGastos();
  }

  @Get('total-by-date-range')
  getTotalGastosByDateRange(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.gastosService.getTotalGastosByDateRange(fechaInicio, fechaFin);
  }

  @Get('total-by-categoria')
  getTotalGastosByCategoria() {
    return this.gastosService.getTotalGastosByCategoria();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.gastosService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGastoDto: UpdateGastoDto,
  ) {
    return this.gastosService.update(id, updateGastoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.gastosService.remove(id);
  }
}