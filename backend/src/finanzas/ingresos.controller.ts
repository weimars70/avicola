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
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { IngresosService } from './ingresos.service';
import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { UpdateIngresoDto } from './dto/update-ingreso.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IdEmpresaHeader } from '../terceros/decorators/empresa.decorator';

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
  findAll(@IdEmpresaHeader() id_empresa: number) {
    return this.ingresosService.findAll(id_empresa);
  }

  @Get('all-including-inactive')
  findAllIncludingInactive(@IdEmpresaHeader() id_empresa: number) {
    return this.ingresosService.findAllIncludingInactive(id_empresa);
  }

  @Get('by-date-range')
  findByDateRange(
    @IdEmpresaHeader() id_empresa: number,
  ) {
    // Para este endpoint, necesitaremos obtener fechaInicio y fechaFin de otra manera
    // Por ahora, devolvemos todos los ingresos
    return this.ingresosService.findAll(id_empresa);
  }

  @Get('by-tipo/:tipo')
  findByTipo(
    @Param('tipo') tipo: string,
    @IdEmpresaHeader() id_empresa: number
  ) {
    return this.ingresosService.findByTipo(tipo, id_empresa);
  }

  @Get('total')
  getTotalIngresos(@IdEmpresaHeader() id_empresa: number) {
    return this.ingresosService.getTotalIngresos(id_empresa);
  }

  @Get('total-by-date-range')
  getTotalIngresosByDateRange(
    @IdEmpresaHeader() id_empresa: number,
  ) {
    // Para este endpoint, necesitaremos obtener fechaInicio y fechaFin de otra manera
    // Por ahora, devolvemos el total de ingresos
    return this.ingresosService.getTotalIngresos(id_empresa);
  }

  @Get('total-by-tipo')
  getTotalIngresosByTipo(@IdEmpresaHeader() id_empresa: number) {
    return this.ingresosService.getTotalIngresosByTipo(id_empresa);
  }

  @Post('sync-from-salidas')
  syncIngresosFromSalidas(@IdEmpresaHeader() id_empresa: number) {
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