import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, Req, Headers, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TercerosService } from './terceros.service';
import { CreateTerceroDto, UpdateTerceroDto } from './dto/create-tercero.dto';
import { Request } from 'express';
import { IdEmpresa } from './decorators/empresa.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('terceros')
@Controller('terceros')
@ApiBearerAuth() // Si usas JWT 
@UseGuards(JwtAuthGuard)
export class TercerosController {
  constructor(private readonly tercerosService: TercerosService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo tercero' })
  async create(
    @Body() createTerceroDto: CreateTerceroDto,
    @IdEmpresa() idEmpresa: number
  ) {
    console.log('📥 POST /terceros recibido');
    console.log('📦 Body recibido:', createTerceroDto);
    console.log('🏢 ID Empresa:', idEmpresa);

    try {
      const result = await this.tercerosService.create(idEmpresa, createTerceroDto);
      console.log('✅ Tercero creado exitosamente:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al crear tercero:', error);
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los terceros' })
  findAll(@IdEmpresa() idEmpresa: number) {
    return this.tercerosService.findAll(idEmpresa);
  }

  @Get('activos')
  @ApiOperation({ summary: 'Obtener terceros activos' })
  findActivos(@IdEmpresa() idEmpresa: number) {
    return this.tercerosService.findActivos(idEmpresa);
  }

  @Get('clientes')
  @ApiOperation({ summary: 'Obtener clientes activos' })
  findClientes(@IdEmpresa() idEmpresa: number) {
    return this.tercerosService.findClientes(idEmpresa);
  }

  @Get('proveedores')
  @ApiOperation({ summary: 'Obtener proveedores activos' })
  findProveedores(@IdEmpresa() idEmpresa: number) {
    return this.tercerosService.findProveedores(idEmpresa);
  }

  @Get('buscar/identificacion')
  @ApiOperation({ summary: 'Buscar por identificación' })
  buscarPorIdentificacion(
    @Query('q') identificacion: string,
    @IdEmpresa() idEmpresa: number
  ) {
    return this.tercerosService.buscarPorIdentificacion(identificacion, idEmpresa);
  }

  @Get('buscar/nombre')
  @ApiOperation({ summary: 'Buscar por nombre' })
  buscarPorNombre(
    @Query('q') nombre: string,
    @IdEmpresa() idEmpresa: number
  ) {
    return this.tercerosService.buscarPorNombre(nombre, idEmpresa);
  }

  @Get(':codigo')
  @ApiOperation({ summary: 'Obtener un tercero por código' })
  findOne(
    @Param('codigo', ParseIntPipe) codigo: number,
    @IdEmpresa() idEmpresa: number
  ) {
    return this.tercerosService.findOne(codigo, idEmpresa);
  }

  @Patch(':codigo')
  @ApiOperation({ summary: 'Actualizar un tercero' })
  update(
    @Param('codigo', ParseIntPipe) codigo: number,
    @Body() updateTerceroDto: UpdateTerceroDto,
    @IdEmpresa() idEmpresa: number
  ) {
    return this.tercerosService.update(codigo, updateTerceroDto, idEmpresa);
  }

  @Delete(':codigo')
  @ApiOperation({ summary: 'Eliminar un tercero' })
  remove(
    @Param('codigo', ParseIntPipe) codigo: number,
    @IdEmpresa() idEmpresa: number
  ) {
    return this.tercerosService.remove(codigo, idEmpresa);
  }
}