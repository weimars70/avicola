import { Repository } from 'typeorm';
import { Canasta } from './entities/canasta.entity';
import { CreateCanastaDto } from './dto/create-canasta.dto';
import { UpdateCanastaDto } from './dto/update-canasta.dto';
import { TiposHuevoService } from '../tipos-huevo/tipos-huevo.service';
export declare class CanastasService {
    private canastasRepository;
    private tiposHuevoService;
    constructor(canastasRepository: Repository<Canasta>, tiposHuevoService: TiposHuevoService);
    create(createCanastaDto: CreateCanastaDto, id_empresa: number, id_usuario_inserta?: string): Promise<Canasta>;
    findAllByEmpresa(id_empresa: number): Promise<Canasta[]>;
    findOne(id: string, id_empresa: number, includeInactive?: boolean): Promise<Canasta>;
    update(id: string, id_empresa: number, updateCanastaDto: UpdateCanastaDto, id_usuario_actualiza?: string): Promise<Canasta>;
    remove(id: string, id_empresa: number): Promise<void>;
    findAllIncludingInactive(id_empresa: number): Promise<Canasta[]>;
}
