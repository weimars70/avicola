import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Galpon } from './entities/galpon.entity';
import { GalponesController } from './galpones.controller';
import { GalponesService } from './galpones.service';

@Module({
  imports: [TypeOrmModule.forFeature([Galpon])],
  controllers: [GalponesController],
  providers: [GalponesService],
  exports: [GalponesService, TypeOrmModule.forFeature([Galpon])],
})
export class GalponesModule {}