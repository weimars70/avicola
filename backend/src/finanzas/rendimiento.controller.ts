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
  ParseIntPipe,
} from '@nestjs/common';
import { RendimientoService } from './rendimiento.service';
import { CreateRendimientoDto } from './dto/create-rendimiento.dto';
import { UpdateRendimientoDto } from './dto/update-rendimiento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('rendimiento')
@UseGuards(JwtAuthGuard)
export class RendimientoController {
  constructor(private readonly rendimientoService: RendimientoService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createRendimientoDto: CreateRendimientoDto) {
    return this.rendimientoService.create(createRendimientoDto);
  }

  @Get()
  findAll() {
    return this.rendimientoService.findAll();
  }

  @Get('metricas')
  getMetricasRendimiento() {
    return this.rendimientoService.getMetricasRendimiento();
  }

  @Get('by-date-range')
  findByDateRange(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.rendimientoService.findByDateRange(fechaInicio, fechaFin);
  }

  @Get('by-periodo/:periodo')
  findByPeriodo(@Param('periodo') periodo: string) {
    return this.rendimientoService.findByPeriodo(periodo);
  }

  @Post('calcular-diario')
  calcularRendimientoDiario(
    @Body('fecha') fecha: string,
    @Query('id_empresa') id_empresa?: number
  ) {
    return this.rendimientoService.calcularRendimientoDiario(fecha, id_empresa || 1);
  }

  @Post('calcular-mensual')
  calcularRendimientoMensual(
    @Body('año', ParseIntPipe) año: number,
    @Body('mes', ParseIntPipe) mes: number,
    @Query('id_empresa') id_empresa?: number
  ) {
    return this.rendimientoService.calcularRendimientoMensual(año, mes, id_empresa || 1);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rendimientoService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRendimientoDto: UpdateRendimientoDto,
  ) {
    return this.rendimientoService.update(id, updateRendimientoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rendimientoService.remove(id);
  }
}