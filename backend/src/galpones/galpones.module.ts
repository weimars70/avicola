import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Galpon } from './entities/galpon.entity';
import { DetalleGalpon } from './entities/detalle-galpon.entity';
import { GalponesController } from './galpones.controller';
import { GalponesService } from './galpones.service';
import { MovimientosGalponController } from './movimientos-galpon.controller';
import { MovimientosGalponService } from './movimientos-galpon.service';

@Module({
  imports: [TypeOrmModule.forFeature([Galpon, DetalleGalpon])],
  controllers: [GalponesController, MovimientosGalponController],
  providers: [GalponesService, MovimientosGalponService],
  exports: [GalponesService, MovimientosGalponService, TypeOrmModule.forFeature([Galpon, DetalleGalpon])],
})
export class GalponesModule { }

