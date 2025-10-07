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
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CanastasService } from './canastas.service';
import { CreateCanastaDto } from './dto/create-canasta.dto';
import { UpdateCanastaDto } from './dto/update-canasta.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('canastas')
@UseGuards(JwtAuthGuard)
export class CanastasController {
  constructor(private readonly canastasService: CanastasService) {}

  @Post()
  create(@Body() createCanastaDto: CreateCanastaDto) {
    return this.canastasService.create(createCanastaDto);
  }

  @Get()
  findAll(@Query('id_empresa', new ParseIntPipe({ errorHttpStatusCode: 400 })) id_empresa: number) {
    return this.canastasService.findAllByEmpresa(id_empresa);
  }

  @Get('all')
  findAllIncludingInactive(@Query('id_empresa', new ParseIntPipe({ errorHttpStatusCode: 400 })) id_empresa: number) {
    return this.canastasService.findAllIncludingInactive(id_empresa);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('id_empresa', ParseIntPipe) id_empresa: number,
  ) {
    return this.canastasService.findOne(id, id_empresa);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('id_empresa', ParseIntPipe) id_empresa: number,
    @Body() updateCanastaDto: UpdateCanastaDto,
  ) {
    return this.canastasService.update(id, id_empresa, updateCanastaDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('id_empresa', ParseIntPipe) id_empresa: number,
  ) {
    return this.canastasService.remove(id, id_empresa);
  }
}