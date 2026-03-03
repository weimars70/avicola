import { GalponesService } from './galpones.service';
import { CreateGalponDto } from './dto/create-galpon.dto';
import { UpdateGalponDto } from './dto/update-galpon.dto';
export declare class GalponesController {
    private readonly galponesService;
    private readonly logger;
    constructor(galponesService: GalponesService);
    create(createGalponDto: CreateGalponDto): Promise<import("./entities/galpon.entity").Galpon>;
    findAll(id_empresa: number): Promise<import("./entities/galpon.entity").Galpon[]>;
    findAllIncludingInactive(id_empresa: number): Promise<import("./entities/galpon.entity").Galpon[]>;
    findOne(id: string, id_empresa: number): Promise<import("./entities/galpon.entity").Galpon>;
    update(id: string, updateGalponDto: UpdateGalponDto, id_empresa: number): Promise<import("./entities/galpon.entity").Galpon>;
    inactivate(id: string, id_empresa: number): Promise<{
        message: string;
    }>;
    reactivate(id: string, id_empresa: number): Promise<{
        message: string;
    }>;
}
