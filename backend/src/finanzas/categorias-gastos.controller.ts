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
} from '@nestjs/common';
import { CategoriasGastosService } from './categorias-gastos.service';
import { CreateCategoriaGastoDto } from './dto/create-categoria-gasto.dto';
import { UpdateCategoriaGastoDto } from './dto/update-categoria-gasto.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('categorias-gastos')
@UseGuards(JwtAuthGuard)
export class CategoriasGastosController {
  constructor(private readonly categoriasGastosService: CategoriasGastosService) {}

  @Post()
  create(@Body() createCategoriaGastoDto: CreateCategoriaGastoDto) {
    return this.categoriasGastosService.create(createCategoriaGastoDto);
  }

  @Get()
  findAll() {
    return this.categoriasGastosService.findAll();
  }

  @Get('all-including-inactive')
  findAllIncludingInactive() {
    return this.categoriasGastosService.findAllIncludingInactive();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriasGastosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoriaGastoDto: UpdateCategoriaGastoDto,
  ) {
    return this.categoriasGastosService.update(id, updateCategoriaGastoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriasGastosService.remove(id);
  }

  @Post('seed')
  seedCategorias() {
    return this.categoriasGastosService.seedCategorias();
  }
}