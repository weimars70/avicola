import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasTercerosService } from './ventas-terceros.service';
import { VentasTercerosController } from './ventas-terceros.controller';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { InventarioTerceros } from '../inventario-terceros/entities/inventario-terceros.entity';
import { Canasta } from '../canastas/entities/canasta.entity';
import { Salida } from '../salidas/entities/salida.entity';
import { Inventario } from '../inventario/entities/inventario.entity';
import { FinanzasModule } from '../finanzas/finanzas.module';

@Module({
    imports: [TypeOrmModule.forFeature([Venta, DetalleVenta, InventarioTerceros, Canasta, Salida, Inventario]), forwardRef(() => FinanzasModule)],
    controllers: [VentasTercerosController],
    providers: [VentasTercerosService],
    exports: [VentasTercerosService],
})
export class VentasTercerosModule { }
