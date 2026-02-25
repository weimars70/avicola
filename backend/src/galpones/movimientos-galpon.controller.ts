import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe, Logger } from '@nestjs/common';
import { MovimientosGalponService } from './movimientos-galpon.service';
import { CreateDetalleGalponDto } from './dto/create-detalle-galpon.dto';
import { UpdateDetalleGalponDto } from './dto/update-detalle-galpon.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IdEmpresa } from '../terceros/decorators/empresa.decorator';
import { IdUsuario } from '../terceros/decorators/usuario.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('movimientos-galpon')
@Controller('movimientos-galpon')
@UseGuards(JwtAuthGuard)
export class MovimientosGalponController {
    private readonly logger = new Logger(MovimientosGalponController.name);

    constructor(private readonly movimientosService: MovimientosGalponService) { }

    @Post()
    @ApiOperation({ summary: 'Registrar un nuevo detalle/actividad en el galpón' })
    async create(
        @Body() createDto: CreateDetalleGalponDto,
        @IdEmpresa() id_empresa: number,
        @IdUsuario() id_usuario: string
    ) {
        this.logger.log(`Registrando detalle para galpón: ${createDto.id_galpon}`);
        return await this.movimientosService.create(createDto, id_empresa, id_usuario);
    }

    @Get('galpon/:id')
    @ApiOperation({ summary: 'Obtener historial de detalles/actividades de un galpón' })
    async findByGalpon(
        @Param('id', ParseUUIDPipe) id: string,
        @IdEmpresa() id_empresa: number
    ) {
        return await this.movimientosService.findByGalpon(id, id_empresa);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener un detalle específico' })
    async findOne(
        @Param('id', ParseUUIDPipe) id: string,
        @IdEmpresa() id_empresa: number
    ) {
        return await this.movimientosService.findOne(id, id_empresa);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar un detalle/actividad' })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateDto: UpdateDetalleGalponDto,
        @IdEmpresa() id_empresa: number,
        @IdUsuario() id_usuario: string
    ) {
        this.logger.log(`Actualizando detalle: ${id}`);
        return await this.movimientosService.update(id, updateDto, id_empresa, id_usuario);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar un detalle/actividad' })
    async remove(
        @Param('id', ParseUUIDPipe) id: string,
        @IdEmpresa() id_empresa: number
    ) {
        this.logger.log(`Eliminando detalle: ${id}`);
        await this.movimientosService.remove(id, id_empresa);
        return { success: true, message: 'Detalle eliminado correctamente' };
    }

    @Get('galpon/:id/poblacion')
    @ApiOperation({ summary: 'Calcular población actual de aves en un galpón' })
    async getPoblacion(
        @Param('id', ParseUUIDPipe) id: string,
        @IdEmpresa() id_empresa: number
    ) {
        const poblacion = await this.movimientosService.getPoblacionActual(id, id_empresa);
        return { poblacion };
    }
}
