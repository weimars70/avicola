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
  BadRequestException,
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
  create(
    @Body() createGastoDto: CreateGastoDto,
    @Query('id_empresa', new ParseIntPipe()) id_empresa: number,
    @Query('id_usuario_inserta') id_usuario_inserta: string | string[],
    @Query('esInversionInicial') esInversionInicial?: string
  ) {
    // Validar que existan los parámetros obligatorios
    if (!id_empresa || !id_usuario_inserta) {
      throw new BadRequestException('id_empresa e id_usuario_inserta son obligatorios');
    }
    
    // Asignar al DTO
    createGastoDto.id_empresa = id_empresa;
    createGastoDto.id_usuario_inserta = Array.isArray(id_usuario_inserta)
      ? id_usuario_inserta[0]
      : id_usuario_inserta;
    
    // Si es inversión inicial, usar el servicio especializado
    if (esInversionInicial === 'true') {
      return this.gastosService.createOrUpdateInversionInicial(
        createGastoDto.monto,
        createGastoDto.fecha,
        undefined, // metaRecuperacion no está en el DTO estándar
        id_empresa,
        createGastoDto.id_usuario_inserta
      );
    }
      
    return this.gastosService.create(createGastoDto);
  }

  @Post('consumo-propio')
  @UsePipes(new ValidationPipe({ transform: true }))
  createConsumoPropio(
    @Body() createConsumoPropioDto: CreateConsumoPropioDto,
    @Query('id_empresa', new ParseIntPipe()) id_empresa: number,
    @Query('id_usuario_inserta') id_usuario_inserta: string | string[]
  ) {
    // Validar que existan
    if (!id_empresa || !id_usuario_inserta) {
      throw new BadRequestException('id_empresa e id_usuario_inserta son obligatorios');
    }
    
    // Asignar al DTO (manejar duplicación)
    createConsumoPropioDto.id_empresa = id_empresa;
    createConsumoPropioDto.id_usuario_inserta = Array.isArray(id_usuario_inserta)
      ? id_usuario_inserta[0]
      : id_usuario_inserta;
      
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