import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprasTercerosService } from './compras-terceros.service';
import { ComprasTercerosController } from './compras-terceros.controller';
import { Compra } from './entities/compra.entity';
import { DetalleCompra } from './entities/detalle-compra.entity';
import { FinanzasModule } from '../finanzas/finanzas.module';

@Module({
    imports: [TypeOrmModule.forFeature([Compra, DetalleCompra]), forwardRef(() => FinanzasModule)],
    controllers: [ComprasTercerosController],
    providers: [ComprasTercerosService],
    exports: [ComprasTercerosService],
})
export class ComprasTercerosModule { }
