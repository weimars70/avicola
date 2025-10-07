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
import { SalidasService } from './salidas.service';
import { CreateSalidaDto } from './dto/create-salida.dto';
import { UpdateSalidaDto } from './dto/update-salida.dto';

@Controller('salidas')
export class SalidasController {
  constructor(private readonly salidasService: SalidasService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(
    @Body() createSalidaDto: CreateSalidaDto,
    @Query('id_empresa', new ParseIntPipe({ errorHttpStatusCode: 400 })) id_empresa: number,
    @Query('id_usuario_inserta') id_usuario_inserta: string
  ) {
    // Aseguramos que id_empresa del DTO coincida con el query param
    createSalidaDto.id_empresa = id_empresa;
    // Asignamos el id_usuario_inserta
    createSalidaDto.id_usuario_inserta = id_usuario_inserta;
    return this.salidasService.create(createSalidaDto, id_empresa);
  }

  @Get()
  findAll(@Query('id_empresa', new ParseIntPipe({ errorHttpStatusCode: 400 })) id_empresa: number) {
    return this.salidasService.findAll(id_empresa);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('id_empresa', ParseIntPipe) id_empresa: number
  ) {
    return this.salidasService.findOne(id, id_empresa);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id') id: string,
    @Body() updateSalidaDto: UpdateSalidaDto,
    @Query('id_empresa', ParseIntPipe) id_empresa: number,
    @Query('id_usuario_actualiza') id_usuario_actualiza: string
  ) {
    // Asignamos el id_usuario_actualiza
    updateSalidaDto.id_usuario_actualiza = id_usuario_actualiza;
    return this.salidasService.update(id, updateSalidaDto, id_empresa);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query('id_empresa', ParseIntPipe) id_empresa: number
  ) {
    return this.salidasService.remove(id, id_empresa);
  }
}