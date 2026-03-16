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
import { TiposHuevoService } from './tipos-huevo.service';
import { CreateTipoHuevoDto } from './dto/create-tipo-huevo.dto';
import { UpdateTipoHuevoDto } from './dto/update-tipo-huevo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IdEmpresa } from '../terceros/decorators/empresa.decorator';

@Controller('tipos-huevo')
@UseGuards(JwtAuthGuard)
export class TiposHuevoController {
  constructor(private readonly tiposHuevoService: TiposHuevoService) { }

  @Post()
  create(
    @Body() createTipoHuevoDto: CreateTipoHuevoDto,
    @IdEmpresa() id_empresa: number,
  ) {
    createTipoHuevoDto.id_empresa = id_empresa;
    return this.tiposHuevoService.create(createTipoHuevoDto);
  }

  @Get()
  findAll(@IdEmpresa() id_empresa: number) {
    return this.tiposHuevoService.findAll(id_empresa);
  }

  @Get('all')
  findAllIncludingInactive(@IdEmpresa() id_empresa: number) {
    return this.tiposHuevoService.findAllIncludingInactive(id_empresa);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @IdEmpresa() id_empresa: number,
  ) {
    return this.tiposHuevoService.findOne(id, id_empresa);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @IdEmpresa() id_empresa: number,
    @Body() updateTipoHuevoDto: UpdateTipoHuevoDto,
  ) {
    return this.tiposHuevoService.update(id, id_empresa, updateTipoHuevoDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @IdEmpresa() id_empresa: number,
  ) {
    return this.tiposHuevoService.remove(id, id_empresa);
  }
}
