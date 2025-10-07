import { Repository } from 'typeorm';
import { Canasta } from './entities/canasta.entity';
import { CreateCanastaDto } from './dto/create-canasta.dto';
import { UpdateCanastaDto } from './dto/update-canasta.dto';
import { TiposHuevoService } from '../tipos-huevo/tipos-huevo.service';
export declare class CanastasService {
    private canastasRepository;
    private tiposHuevoService;
    constructor(canastasRepository: Repository<Canasta>, tiposHuevoService: TiposHuevoService);
    create(createCanastaDto: CreateCanastaDto): Promise<Canasta>;
    findAllByEmpresa(id_empresa: number): Promise<Canasta[]>;
    findOne(id: string, id_empresa: number): Promise<Canasta>;
    update(id: string, id_empresa: number, updateCanastaDto: UpdateCanastaDto): Promise<Canasta>;
    remove(id: string, id_empresa: number): Promise<void>;
    findAllIncludingInactive(id_empresa: number): Promise<Canasta[]>;
}
