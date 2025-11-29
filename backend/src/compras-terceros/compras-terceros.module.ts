import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprasTercerosService } from './compras-terceros.service';
import { ComprasTercerosController } from './compras-terceros.controller';
import { Compra } from './entities/compra.entity';
import { DetalleCompra } from './entities/detalle-compra.entity';
import { InventarioTerceros } from '../inventario-terceros/entities/inventario-terceros.entity';
import { Canasta } from '../canastas/entities/canasta.entity';
import { Tercero } from '../terceros/entities/tercero.entity';
import { FinanzasModule } from '../finanzas/finanzas.module';

@Module({
    imports: [TypeOrmModule.forFeature([Compra, DetalleCompra, InventarioTerceros, Canasta, Tercero]), forwardRef(() => FinanzasModule)],
    controllers: [ComprasTercerosController],
    providers: [ComprasTercerosService],
    exports: [ComprasTercerosService],
})
export class ComprasTercerosModule { }
