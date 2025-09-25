import { Repository } from 'typeorm';
import { Galpon } from './entities/galpon.entity';
import { CreateGalponDto } from './dto/create-galpon.dto';
import { UpdateGalponDto } from './dto/update-galpon.dto';
export declare class GalponesService {
    private galponesRepository;
    private readonly logger;
    constructor(galponesRepository: Repository<Galpon>);
    create(createGalponDto: CreateGalponDto): Promise<Galpon>;
    findAll(): Promise<Galpon[]>;
    findOne(id: string): Promise<Galpon>;
    update(id: string, updateGalponDto: UpdateGalponDto): Promise<Galpon>;
    remove(id: string): Promise<void>;
    reactivate(id: string): Promise<void>;
    findAllIncludingInactive(): Promise<Galpon[]>;
}
