import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { GalponesModule } from './galpones/galpones.module';
import { TiposHuevoModule } from './tipos-huevo/tipos-huevo.module';
import { CanastasModule } from './canastas/canastas.module';
import { InventarioModule } from './inventario/inventario.module';
import { EntradasProduccionModule } from './entradas-produccion/entradas-produccion.module';
import { SalidasModule } from './salidas/salidas.module';
import { FinanzasModule } from './finanzas/finanzas.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    GalponesModule,
    TiposHuevoModule,
    CanastasModule,
    InventarioModule,
    EntradasProduccionModule,
    SalidasModule,
    FinanzasModule,
    NotificationsModule,
  ],
})
export class AppModule {}