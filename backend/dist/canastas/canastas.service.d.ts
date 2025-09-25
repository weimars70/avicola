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
    findAll(): Promise<Canasta[]>;
    findOne(id: string): Promise<Canasta>;
    update(id: string, updateCanastaDto: UpdateCanastaDto): Promise<Canasta>;
    remove(id: string): Promise<void>;
    findAllIncludingInactive(): Promise<Canasta[]>;
}
