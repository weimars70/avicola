import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ComprasTercerosService } from './compras-terceros.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IdEmpresaHeader } from '../terceros/decorators/empresa.decorator';

@Controller('compras-terceros')
@UseGuards(JwtAuthGuard)
export class ComprasTercerosController {
    constructor(private readonly comprasTercerosService: ComprasTercerosService) { }

    @Post()
    create(@Body() createCompraDto: CreateCompraDto, @Request() req: any) {
        const idEmpresa = req.user?.idEmpresa ?? req.user?.id_empresa ?? Number(req.headers['x-empresa-id']) ?? 0;
        const idUsuario = req.query?.id_usuario_inserta || req.user?.userId || req.user?.id_usuario || '';
        return this.comprasTercerosService.create(createCompraDto, idEmpresa, idUsuario);
    }

    @Get()
    findAll(@IdEmpresaHeader() idEmpresa: number) {
        return this.comprasTercerosService.findAll(idEmpresa);
    }

    @Get('estadisticas')
    getEstadisticas(@IdEmpresaHeader() idEmpresa: number) {
        return this.comprasTercerosService.getEstadisticas(idEmpresa);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @IdEmpresaHeader() idEmpresa: number) {
        return this.comprasTercerosService.findOne(id, idEmpresa);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCompraDto: UpdateCompraDto, @IdEmpresaHeader() idEmpresa: number) {
        return this.comprasTercerosService.update(id, updateCompraDto, idEmpresa);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @IdEmpresaHeader() idEmpresa: number) {
        return this.comprasTercerosService.remove(id, idEmpresa);
    }
}
