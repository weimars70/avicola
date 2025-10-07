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
  findAll() {
    return this.ingresosService.findAll();
  }

  @Get('all-including-inactive')
  findAllIncludingInactive() {
    return this.ingresosService.findAllIncludingInactive();
  }

  @Get('by-date-range')
  findByDateRange(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.ingresosService.findByDateRange(fechaInicio, fechaFin);
  }

  @Get('by-tipo/:tipo')
  findByTipo(@Param('tipo') tipo: string) {
    return this.ingresosService.findByTipo(tipo);
  }

  @Get('total')
  getTotalIngresos(@Query('id_empresa') id_empresa: number) {
    // Usar el id_empresa de la petición
    return this.ingresosService.getTotalIngresos(id_empresa || 1);
  }

  @Get('total-by-date-range')
  getTotalIngresosByDateRange(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.ingresosService.getTotalIngresosByDateRange(fechaInicio, fechaFin);
  }

  @Get('total-by-tipo')
  getTotalIngresosByTipo() {
    return this.ingresosService.getTotalIngresosByTipo();
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