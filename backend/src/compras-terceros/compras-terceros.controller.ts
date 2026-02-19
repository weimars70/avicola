import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { ComprasTercerosService } from './compras-terceros.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IdEmpresa } from '../terceros/decorators/empresa.decorator';

@Controller('compras-terceros')
@UseGuards(JwtAuthGuard)
export class ComprasTercerosController {
    constructor(private readonly comprasTercerosService: ComprasTercerosService) { }

    @Post()
    create(@Body() createCompraDto: CreateCompraDto, @Request() req: any) {
        const idEmpresa = req.user?.idEmpresa ?? req.user?.id_empresa;
        if (!idEmpresa) throw new Error('Company ID missing in user context');

        const idUsuario = req.query?.id_usuario_inserta || req.user?.userId || req.user?.id_usuario || '';
        return this.comprasTercerosService.create(createCompraDto, Number(idEmpresa), idUsuario);
    }

    @Get()
    findAll(@IdEmpresa() idEmpresa: number) {
        return this.comprasTercerosService.findAll(idEmpresa);
    }

    @Get('estadisticas')
    getEstadisticas(@IdEmpresa() idEmpresa: number) {
        return this.comprasTercerosService.getEstadisticas(idEmpresa);
    }

    @Get('inventario-canastas')
    getInventarioCanastas(@IdEmpresa() idEmpresa: number) {
        return this.comprasTercerosService.getInventarioCanastas(idEmpresa);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @IdEmpresa() idEmpresa: number) {
        return this.comprasTercerosService.findOne(id, idEmpresa);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCompraDto: UpdateCompraDto, @IdEmpresa() idEmpresa: number) {
        return this.comprasTercerosService.update(id, updateCompraDto, idEmpresa);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @IdEmpresa() idEmpresa: number) {
        return this.comprasTercerosService.remove(id, idEmpresa);
    }
}
