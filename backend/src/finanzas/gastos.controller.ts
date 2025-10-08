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
  ParseIntPipe,
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
  findAll(@Query('id_empresa', new ParseIntPipe()) id_empresa: number) {
    return this.gastosService.findAll(id_empresa);
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
  getTotalGastos(@Query('id_empresa', new ParseIntPipe()) id_empresa: number) {
    return this.gastosService.getTotalGastos(id_empresa);
  }

  @Get('total-by-date-range')
  getTotalGastosByDateRange(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query('id_empresa', new ParseIntPipe()) id_empresa: number,
  ) {
    return this.gastosService.getTotalGastosByDateRange(fechaInicio, fechaFin, id_empresa);
  }

  @Get('total-by-categoria')
  getTotalGastosByCategoria(@Query('id_empresa', new ParseIntPipe()) id_empresa: number) {
    return this.gastosService.getTotalGastosByCategoria(id_empresa);
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
    console.log('=== CONTROLADOR GASTOS: PATCH ===');
    console.log('ID recibido:', id);
    console.log('DTO recibido:', JSON.stringify(updateGastoDto));
    console.log('Tipo de datos:', {
      descripcion: typeof updateGastoDto.descripcion,
      monto: typeof updateGastoDto.monto,
      fecha: typeof updateGastoDto.fecha,
      observaciones: typeof updateGastoDto.observaciones,
      categoriaId: typeof updateGastoDto.categoriaId
    });
    
    try {
      const result = this.gastosService.update(id, updateGastoDto);
      console.log('=== CONTROLADOR GASTOS: ÉXITO ===');
      return result;
    } catch (error) {
      console.error('=== CONTROLADOR GASTOS: ERROR ===');
      console.error('Error:', error.message);
      console.error('Stack:', error.stack);
      throw error;
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.gastosService.remove(id);
  }
}