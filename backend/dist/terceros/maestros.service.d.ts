import { Repository } from 'typeorm';
import { Ciudad } from './entities/ciudad.entity';
import { Estrato } from './entities/estrato.entity';
import { TipoRegimen } from './entities/tipo-regimen.entity';
import { TipoIdent } from './entities/tipo-ident.entity';
import { TipoImpuesto } from './entities/tipo-impuesto.entity';
export declare class MaestrosService {
    private readonly ciudadRepository;
    private readonly estratoRepository;
    private readonly tipoRegimenRepository;
    private readonly tipoIdentRepository;
    private readonly tipoImpuestoRepository;
    constructor(ciudadRepository: Repository<Ciudad>, estratoRepository: Repository<Estrato>, tipoRegimenRepository: Repository<TipoRegimen>, tipoIdentRepository: Repository<TipoIdent>, tipoImpuestoRepository: Repository<TipoImpuesto>);
    findAllCiudades(activo?: boolean): Promise<Ciudad[]>;
    findAllEstratos(activo?: boolean, idEmpresa?: number): Promise<{
        codigo: number;
        nombre: string;
        idEmpresa: number;
    }[]>;
    findAllTiposRegimen(activo?: boolean): Promise<TipoRegimen[]>;
    findAllTiposIdent(activo?: boolean): Promise<TipoIdent[]>;
    findAllTiposImpuesto(activo?: boolean): Promise<TipoImpuesto[]>;
}
