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
import { TiposHuevoService } from './tipos-huevo.service';
import { CreateTipoHuevoDto } from './dto/create-tipo-huevo.dto';
import { UpdateTipoHuevoDto } from './dto/update-tipo-huevo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tipos-huevo')
@UseGuards(JwtAuthGuard)
export class TiposHuevoController {
  constructor(private readonly tiposHuevoService: TiposHuevoService) {}

  @Post()
  create(@Body() createTipoHuevoDto: CreateTipoHuevoDto) {
    return this.tiposHuevoService.create(createTipoHuevoDto);
  }

  @Get()
  findAll(@Query('id_empresa', new ParseIntPipe({ errorHttpStatusCode: 400 })) id_empresa: number) {
    return this.tiposHuevoService.findAll(id_empresa);
  }

  @Get('all')
  findAllIncludingInactive() {
    return this.tiposHuevoService.findAllIncludingInactive();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tiposHuevoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTipoHuevoDto: UpdateTipoHuevoDto,
  ) {
    return this.tiposHuevoService.update(id, updateTipoHuevoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tiposHuevoService.remove(id);
  }
}