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

@Controller('canastas')
@UseGuards(JwtAuthGuard)
export class CanastasController {
  constructor(private readonly canastasService: CanastasService) {}

  @Post()
  create(@Body() createCanastaDto: CreateCanastaDto) {
    return this.canastasService.create(createCanastaDto);
  }

  @Get()
  findAll() {
    return this.canastasService.findAll();
  }

  @Get('all')
  findAllIncludingInactive() {
    return this.canastasService.findAllIncludingInactive();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.canastasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCanastaDto: UpdateCanastaDto,
  ) {
    return this.canastasService.update(id, updateCanastaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.canastasService.remove(id);
  }
}