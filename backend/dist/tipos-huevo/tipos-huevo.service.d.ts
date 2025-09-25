import { Repository } from 'typeorm';
import { TipoHuevo } from './entities/tipo-huevo.entity';
import { CreateTipoHuevoDto } from './dto/create-tipo-huevo.dto';
import { UpdateTipoHuevoDto } from './dto/update-tipo-huevo.dto';
export declare class TiposHuevoService {
    private tiposHuevoRepository;
    constructor(tiposHuevoRepository: Repository<TipoHuevo>);
    create(createTipoHuevoDto: CreateTipoHuevoDto): Promise<TipoHuevo>;
    findAll(): Promise<TipoHuevo[]>;
    findOne(id: string): Promise<TipoHuevo>;
    update(id: string, updateTipoHuevoDto: UpdateTipoHuevoDto): Promise<TipoHuevo>;
    remove(id: string): Promise<void>;
    findAllIncludingInactive(): Promise<TipoHuevo[]>;
}
