import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { EntradasProduccionService } from './entradas-produccion.service';
import { CreateEntradaProduccionDto } from './dto/create-entrada-produccion.dto';
import { UpdateEntradaProduccionDto } from './dto/update-entrada-produccion.dto';
import { CreateEntradasMasivasDto } from './dto/create-entradas-masivas.dto';

@Controller('entradas-produccion')
export class EntradasProduccionController {
  constructor(private readonly entradasProduccionService: EntradasProduccionService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() createEntradaProduccionDto: CreateEntradaProduccionDto) {
    return this.entradasProduccionService.create(createEntradaProduccionDto);
  }

  @Post('masivas')
  @UsePipes(new ValidationPipe({ transform: true }))
  createMasivas(@Body() createEntradasMasivasDto: CreateEntradasMasivasDto) {
    return this.entradasProduccionService.createMasivas(createEntradasMasivasDto);
  }

  @Get()
  findAll() {
    return this.entradasProduccionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.entradasProduccionService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id') id: string,
    @Body() updateEntradaProduccionDto: UpdateEntradaProduccionDto,
  ) {
    return this.entradasProduccionService.update(id, updateEntradaProduccionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.entradasProduccionService.remove(id);
  }
}