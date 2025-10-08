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
import { IngresosService } from './ingresos.service';
import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { UpdateIngresoDto } from './dto/update-ingreso.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ingresos')
@UseGuards(JwtAuthGuard)
export class IngresosController {
  constructor(private readonly ingresosService: IngresosService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createIngresoDto: CreateIngresoDto) {
    return this.ingresosService.create(createIngresoDto);
  }

  @Get()
  findAll(@Query('id_empresa', new ParseIntPipe()) id_empresa: number) {
    return this.ingresosService.findAll(id_empresa);
  }

  @Get('all-including-inactive')
  findAllIncludingInactive(@Query('id_empresa', new ParseIntPipe()) id_empresa: number) {
    return this.ingresosService.findAllIncludingInactive(id_empresa);
  }

  @Get('by-date-range')
  findByDateRange(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('id_empresa', new ParseIntPipe()) id_empresa: number,
  ) {
    return this.ingresosService.findByDateRange(fechaInicio, fechaFin, id_empresa);
  }

  @Get('by-tipo/:tipo')
  findByTipo(
    @Param('tipo') tipo: string,
    @Query('id_empresa', new ParseIntPipe()) id_empresa: number
  ) {
    return this.ingresosService.findByTipo(tipo, id_empresa);
  }

  @Get('total')
  getTotalIngresos(@Query('id_empresa', new ParseIntPipe()) id_empresa: number) {
    return this.ingresosService.getTotalIngresos(id_empresa);
  }

  @Get('total-by-date-range')
  getTotalIngresosByDateRange(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('id_empresa', new ParseIntPipe()) id_empresa: number,
  ) {
    return this.ingresosService.getTotalIngresosByDateRange(fechaInicio, fechaFin, id_empresa);
  }

  @Get('total-by-tipo')
  getTotalIngresosByTipo(@Query('id_empresa', new ParseIntPipe()) id_empresa: number) {
    return this.ingresosService.getTotalIngresosByTipo(id_empresa);
  }

  @Post('sync-from-salidas')
  syncIngresosFromSalidas(@Query('id_empresa', ParseIntPipe) id_empresa: number) {
    return this.ingresosService.syncIngresosFromSalidas(id_empresa);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingresosService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateIngresoDto: UpdateIngresoDto,
  ) {
    return this.ingresosService.update(id, updateIngresoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.ingresosService.remove(id);
  }
}