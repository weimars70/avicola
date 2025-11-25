import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { VentasTercerosService } from './ventas-terceros.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IdEmpresaHeader } from '../terceros/decorators/empresa.decorator';

@Controller('ventas-terceros')
@UseGuards(JwtAuthGuard)
export class VentasTercerosController {
    constructor(private readonly ventasTercerosService: VentasTercerosService) { }

    @Post()
    create(@Body() createVentaDto: CreateVentaDto, @Request() req: any) {
        const idEmpresa = req.user?.idEmpresa ?? req.user?.id_empresa ?? Number(req.headers['x-empresa-id']) ?? 0;
        const idUsuario = req.query?.id_usuario_inserta || req.user?.userId || req.user?.id_usuario || '';
        return this.ventasTercerosService.create(createVentaDto, idEmpresa, idUsuario);
    }

    @Get()
    findAll(@IdEmpresaHeader() idEmpresa: number) {
        return this.ventasTercerosService.findAll(idEmpresa);
    }

    @Get('estadisticas')
    getEstadisticas(@IdEmpresaHeader() idEmpresa: number) {
        return this.ventasTercerosService.getEstadisticas(idEmpresa);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @IdEmpresaHeader() idEmpresa: number) {
        return this.ventasTercerosService.findOne(id, idEmpresa);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateVentaDto: UpdateVentaDto, @IdEmpresaHeader() idEmpresa: number) {
        return this.ventasTercerosService.update(id, updateVentaDto, idEmpresa);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @IdEmpresaHeader() idEmpresa: number) {
        return this.ventasTercerosService.remove(id, idEmpresa);
    }
}
