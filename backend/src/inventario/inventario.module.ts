import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Inventario } from './entities/inventario.entity';
import { AjusteInventario } from './entities/ajuste-inventario.entity';
import { AjusteLote } from './entities/ajuste-lote.entity';
import { EntradaProduccion } from '../entradas-produccion/entities/entrada-produccion.entity';
import { Salida } from '../salidas/entities/salida.entity';
import { InventarioTerceros } from '../inventario-terceros/entities/inventario-terceros.entity';
import { Canasta } from '../canastas/entities/canasta.entity';
import { InventarioStockController } from './inventario-stock.controller';
import { InventarioStockService } from './inventario-stock.service';
import { AjustesInventarioController } from './ajustes-inventario.controller';
import { AjustesInventarioService } from './ajustes-inventario.service';
import { ResumenController } from './resumen.controller';
import { ResumenService } from './resumen.service';

import { GalponesModule } from '../galpones/galpones.module';
import { TiposHuevoModule } from '../tipos-huevo/tipos-huevo.module';
import { CanastasModule } from '../canastas/canastas.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventario, AjusteInventario, AjusteLote, EntradaProduccion, Salida, InventarioTerceros, Canasta]),
    GalponesModule,
    TiposHuevoModule,
    CanastasModule,
    UsersModule,
  ],
  controllers: [InventarioStockController, AjustesInventarioController, ResumenController],
  providers: [InventarioStockService, AjustesInventarioService, ResumenService],
  exports: [InventarioStockService, AjustesInventarioService, ResumenService],
})
export class InventarioModule {}
