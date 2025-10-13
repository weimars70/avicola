import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TercerosController } from './terceros.controller';
import { TercerosService } from './terceros.service';
import { MaestrosController } from './maestros.controller';
import { MaestrosService } from './maestros.service';
import { Tercero } from './entities/tercero.entity';
import { Ciudad } from './entities/ciudad.entity';
import { Estrato } from './entities/estrato.entity';
import { TipoRegimen } from './entities/tipo-regimen.entity';
import { TipoIdent } from './entities/tipo-ident.entity';
import { TipoImpuesto } from './entities/tipo-impuesto.entity';

console.log('📋 CARGANDO TercerosModule...');

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tercero,
      Ciudad,
      Estrato,
      TipoRegimen,
      TipoIdent,
      TipoImpuesto
    ])
  ],
  controllers: [TercerosController, MaestrosController],
  providers: [TercerosService, MaestrosService],
  exports: [TercerosService]
})
export class TercerosModule {
  constructor() {
    console.log('✅ TercerosModule inicializado correctamente');
    console.log('🎯 Controladores registrados: TercerosController, MaestrosController');
    console.log('⚙️ Servicios registrados: TercerosService, MaestrosService');
  }
}