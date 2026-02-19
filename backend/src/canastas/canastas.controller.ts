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
import { CanastasService } from './canastas.service';
import { CreateCanastaDto } from './dto/create-canasta.dto';
import { UpdateCanastaDto } from './dto/update-canasta.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IdEmpresa } from '../terceros/decorators/empresa.decorator';

@Controller('canastas')
@UseGuards(JwtAuthGuard)
export class CanastasController {
  constructor(private readonly canastasService: CanastasService) { }

  @Post()
  create(@Body() createCanastaDto: CreateCanastaDto) {
    return this.canastasService.create(createCanastaDto);
  }

  @Get()
  findAll(@IdEmpresa() id_empresa: number) {
    return this.canastasService.findAllByEmpresa(id_empresa);
  }

  @Get('all')
  findAllIncludingInactive(@IdEmpresa() id_empresa: number) {
    return this.canastasService.findAllIncludingInactive(id_empresa);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @IdEmpresa() id_empresa: number,
  ) {
    return this.canastasService.findOne(id, id_empresa);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @IdEmpresa() id_empresa: number,
    @Body() updateCanastaDto: UpdateCanastaDto,
  ) {
    return this.canastasService.update(id, id_empresa, updateCanastaDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @IdEmpresa() id_empresa: number,
  ) {
    return this.canastasService.remove(id, id_empresa);
  }
}