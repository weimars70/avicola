import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalidasService } from './salidas.service';
import { SalidasController } from './salidas.controller';
import { Salida } from './entities/salida.entity';
import { TiposHuevoModule } from '../tipos-huevo/tipos-huevo.module';
import { CanastasModule } from '../canastas/canastas.module';
import { InventarioModule } from '../inventario/inventario.module';
import { FinanzasModule } from '../finanzas/finanzas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Salida]),
    TiposHuevoModule,
    CanastasModule,
    InventarioModule,
    forwardRef(() => FinanzasModule),
  ],
  controllers: [SalidasController],
  providers: [SalidasService],
  exports: [SalidasService],
})
export class SalidasModule {}