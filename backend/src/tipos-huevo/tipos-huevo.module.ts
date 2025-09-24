import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoHuevo } from './entities/tipo-huevo.entity';
import { TiposHuevoController } from './tipos-huevo.controller';
import { TiposHuevoService } from './tipos-huevo.service';

@Module({
  imports: [TypeOrmModule.forFeature([TipoHuevo])],
  controllers: [TiposHuevoController],
  providers: [TiposHuevoService],
  exports: [TiposHuevoService, TypeOrmModule.forFeature([TipoHuevo])],
})
export class TiposHuevoModule {}