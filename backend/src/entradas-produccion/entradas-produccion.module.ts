import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntradasProduccionService } from './entradas-produccion.service';
import { EntradasProduccionController } from './entradas-produccion.controller';
import { EntradaProduccion } from './entities/entrada-produccion.entity';
import { GalponesModule } from '../galpones/galpones.module';
import { TiposHuevoModule } from '../tipos-huevo/tipos-huevo.module';
import { InventarioModule } from '../inventario/inventario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EntradaProduccion]),
    GalponesModule,
    TiposHuevoModule,
    InventarioModule,
  ],
  controllers: [EntradasProduccionController],
  providers: [EntradasProduccionService],
  exports: [EntradasProduccionService],
})
export class EntradasProduccionModule {}