import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaGasto } from './entities/categoria-gasto.entity';
import { Gasto } from './entities/gasto.entity';
import { Ingreso } from './entities/ingreso.entity';
import { Rendimiento } from './entities/rendimiento.entity';
import { GastosService } from './gastos.service';
import { CategoriasGastosService } from './categorias-gastos.service';
import { IngresosService } from './ingresos.service';
import { RendimientoService } from './rendimiento.service';
import { GastosController } from './gastos.controller';
import { CategoriasGastosController } from './categorias-gastos.controller';
import { IngresosController } from './ingresos.controller';
import { RendimientoController } from './rendimiento.controller';
import { FinanzasController } from './finanzas.controller';
import { ActividadesController } from './actividades.controller';
import { ResumenService } from './resumen.service';
import { ActividadesService } from './actividades.service';
import { SalidasModule } from '../salidas/salidas.module';
import { GalponesModule } from '../galpones/galpones.module';
import { EntradasProduccionModule } from '../entradas-produccion/entradas-produccion.module';
import { InventarioModule } from '../inventario/inventario.module';
import { TiposHuevoModule } from '../tipos-huevo/tipos-huevo.module';
import { Compra } from '../compras-terceros/entities/compra.entity';
import { Venta } from '../ventas-terceros/entities/venta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoriaGasto, Gasto, Ingreso, Rendimiento, Compra, Venta]),
    forwardRef(() => SalidasModule),
    GalponesModule,
    EntradasProduccionModule,
    InventarioModule,
    TiposHuevoModule,
  ],
  controllers: [GastosController, CategoriasGastosController, IngresosController, RendimientoController, FinanzasController, ActividadesController],
  providers: [GastosService, CategoriasGastosService, IngresosService, RendimientoService, ResumenService, ActividadesService],
  exports: [GastosService, CategoriasGastosService, IngresosService, RendimientoService, ResumenService, ActividadesService],
})
export class FinanzasModule {}