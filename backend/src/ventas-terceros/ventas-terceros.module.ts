import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasTercerosService } from './ventas-terceros.service';
import { VentasTercerosController } from './ventas-terceros.controller';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { FinanzasModule } from '../finanzas/finanzas.module';

@Module({
    imports: [TypeOrmModule.forFeature([Venta, DetalleVenta]), forwardRef(() => FinanzasModule)],
    controllers: [VentasTercerosController],
    providers: [VentasTercerosService],
    exports: [VentasTercerosService],
})
export class VentasTercerosModule { }
