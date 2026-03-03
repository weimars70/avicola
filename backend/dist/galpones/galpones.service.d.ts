import { Repository } from 'typeorm';
import { Galpon } from './entities/galpon.entity';
import { CreateGalponDto } from './dto/create-galpon.dto';
import { UpdateGalponDto } from './dto/update-galpon.dto';
export declare class GalponesService {
    private galponesRepository;
    private readonly logger;
    constructor(galponesRepository: Repository<Galpon>);
    create(createGalponDto: CreateGalponDto): Promise<Galpon>;
    findAll(id_empresa: number): Promise<Galpon[]>;
    findOne(id: string, id_empresa: number): Promise<Galpon>;
    update(id: string, updateGalponDto: UpdateGalponDto, id_empresa: number): Promise<Galpon>;
    remove(id: string, id_empresa: number): Promise<void>;
    reactivate(id: string, id_empresa: number): Promise<void>;
    findAllIncludingInactive(id_empresa: number): Promise<Galpon[]>;
}
