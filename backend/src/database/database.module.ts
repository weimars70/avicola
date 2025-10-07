import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Galpon } from '../galpones/entities/galpon.entity';
import { TipoHuevo } from '../tipos-huevo/entities/tipo-huevo.entity';
import { Canasta } from '../canastas/entities/canasta.entity';

import { EntradaProduccion } from '../entradas-produccion/entities/entrada-produccion.entity';
import { Salida } from '../salidas/entities/salida.entity';
import { Inventario } from '../inventario/entities/inventario.entity';
import { AjusteInventario } from '../inventario/entities/ajuste-inventario.entity';
import { AjusteLote } from '../inventario/entities/ajuste-lote.entity';
import { CategoriaGasto } from '../finanzas/entities/categoria-gasto.entity';
import { Gasto } from '../finanzas/entities/gasto.entity';
import { Ingreso } from '../finanzas/entities/ingreso.entity';
import { Rendimiento } from '../finanzas/entities/rendimiento.entity';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: parseInt(configService.get<string>('DB_PORT', '5432')),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'password'),
        database: configService.get<string>('DB_NAME', 'galpones_db'),
        entities: [User, Galpon, TipoHuevo, Canasta, EntradaProduccion, Salida, Inventario, AjusteInventario, AjusteLote, CategoriaGasto, Gasto, Ingreso, Rendimiento],
        synchronize: configService.get('NODE_ENV') !== 'production',
        //logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}