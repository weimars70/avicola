import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ciudad } from './entities/ciudad.entity';
import { Estrato } from './entities/estrato.entity';
import { TipoRegimen } from './entities/tipo-regimen.entity';
import { TipoIdent } from './entities/tipo-ident.entity';
import { TipoImpuesto } from './entities/tipo-impuesto.entity';

@Injectable()
export class MaestrosService {
  constructor(
    @InjectRepository(Ciudad)
    private readonly ciudadRepository: Repository<Ciudad>,
    
    @InjectRepository(Estrato)
    private readonly estratoRepository: Repository<Estrato>,
    
    @InjectRepository(TipoRegimen)
    private readonly tipoRegimenRepository: Repository<TipoRegimen>,
    
    @InjectRepository(TipoIdent)
    private readonly tipoIdentRepository: Repository<TipoIdent>,
    
    @InjectRepository(TipoImpuesto)
    private readonly tipoImpuestoRepository: Repository<TipoImpuesto>,
  ) {}

  async findAllCiudades(activo?: boolean) {
    const query = this.ciudadRepository.createQueryBuilder('ciudad');
    
    if (activo !== undefined) {
      query.where('ciudad.activo = :activo', { activo });
    }
    
    return query.orderBy('ciudad.nombre', 'ASC').getMany();
  }

  async findAllEstratos(activo?: boolean, idEmpresa?: number) {
    // Devolver directamente los datos predeterminados sin intentar consultar la base de datos
    const defaultEstratos = [
      { codigo: 1, nombre: 'Estrato 1', idEmpresa: idEmpresa || null },
      { codigo: 2, nombre: 'Estrato 2', idEmpresa: idEmpresa || null },
      { codigo: 3, nombre: 'Estrato 3', idEmpresa: idEmpresa || null },
      { codigo: 4, nombre: 'Estrato 4', idEmpresa: idEmpresa || null },
      { codigo: 5, nombre: 'Estrato 5', idEmpresa: idEmpresa || null },
      { codigo: 6, nombre: 'Estrato 6', idEmpresa: idEmpresa || null }
    ];
    
    console.log('Devolviendo estratos predeterminados sin consultar la base de datos');
    return defaultEstratos;
  }

  async findAllTiposRegimen(activo?: boolean) {
    const query = this.tipoRegimenRepository.createQueryBuilder('tipoRegimen');
    
    if (activo !== undefined) {
      query.where('tipoRegimen.activo = :activo', { activo });
    }
    
    return query.orderBy('tipoRegimen.nombre', 'ASC').getMany();
  }

  async findAllTiposIdent(activo?: boolean) {
    const query = this.tipoIdentRepository.createQueryBuilder('tipoIdent');
    
    if (activo !== undefined) {
      query.where('tipoIdent.activo = :activo', { activo });
    }
    
    return query.orderBy('tipoIdent.nombre', 'ASC').getMany();
  }

  async findAllTiposImpuesto(activo?: boolean) {
    const query = this.tipoImpuestoRepository.createQueryBuilder('tipoImpuesto');
    
    if (activo !== undefined) {
      query.where('tipoImpuesto.activo = :activo', { activo });
    }
    
    return query.orderBy('tipoImpuesto.nombre', 'ASC').getMany();
  }
}