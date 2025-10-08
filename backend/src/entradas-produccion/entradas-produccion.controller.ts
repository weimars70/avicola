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
  Query,
  ParseIntPipe,
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
  create(
    @Body() createEntradaProduccionDto: CreateEntradaProduccionDto,
    @Query('id_empresa', new ParseIntPipe({ errorHttpStatusCode: 400 })) id_empresa: number,
    @Query('id_usuario_inserta') id_usuario_inserta: string
  ) {
    // Aseguramos que id_empresa del DTO coincida con el query param
    createEntradaProduccionDto.id_empresa = id_empresa;
    // Asignamos el id_usuario_inserta
    createEntradaProduccionDto.id_usuario_inserta = id_usuario_inserta;
    return this.entradasProduccionService.create(createEntradaProduccionDto);
  }

  @Post('masivas')
  @UsePipes(new ValidationPipe({ transform: true }))
  createMasivas(
    @Body() createEntradasMasivasDto: CreateEntradasMasivasDto,
    @Query('id_empresa', new ParseIntPipe({ errorHttpStatusCode: 400 })) id_empresa: number,
    @Query('id_usuario_inserta') id_usuario_inserta: string
  ) {
    // Aseguramos que id_empresa del DTO coincida con el query param
    createEntradasMasivasDto.id_empresa = id_empresa;
    // Asignamos el id_usuario_inserta
    createEntradasMasivasDto.id_usuario_inserta = id_usuario_inserta;
    return this.entradasProduccionService.createMasivas(createEntradasMasivasDto);
  }

  @Get()
  findAll(@Query('id_empresa', new ParseIntPipe({ errorHttpStatusCode: 400 })) id_empresa: number) {
    return this.entradasProduccionService.findAll(id_empresa);
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