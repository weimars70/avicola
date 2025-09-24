import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Canasta } from './entities/canasta.entity';
import { CanastasController } from './canastas.controller';
import { CanastasService } from './canastas.service';
import { TiposHuevoModule } from '../tipos-huevo/tipos-huevo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Canasta]),
    TiposHuevoModule
  ],
  controllers: [CanastasController],
  providers: [CanastasService],
  exports: [CanastasService],
})
export class CanastasModule {}