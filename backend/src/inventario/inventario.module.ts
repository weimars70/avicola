import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Inventario } from './entities/inventario.entity';
import { EntradaProduccion } from '../entradas-produccion/entities/entrada-produccion.entity';
import { Salida } from '../salidas/entities/salida.entity';
import { InventarioStockController } from './inventario-stock.controller';
import { InventarioStockService } from './inventario-stock.service';
import { ResumenController } from './resumen.controller';
import { ResumenService } from './resumen.service';
import { GalponesModule } from '../galpones/galpones.module';
import { TiposHuevoModule } from '../tipos-huevo/tipos-huevo.module';
import { CanastasModule } from '../canastas/canastas.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventario, EntradaProduccion, Salida]),
    GalponesModule,
    TiposHuevoModule,
    CanastasModule,
    UsersModule,
  ],
  controllers: [InventarioStockController, ResumenController],
  providers: [InventarioStockService, ResumenService],
  exports: [InventarioStockService, ResumenService],
})
export class InventarioModule {}