import { GalponesService } from './galpones.service';
import { CreateGalponDto } from './dto/create-galpon.dto';
import { UpdateGalponDto } from './dto/update-galpon.dto';
export declare class GalponesController {
    private readonly galponesService;
    private readonly logger;
    constructor(galponesService: GalponesService);
    create(createGalponDto: CreateGalponDto): Promise<import("./entities/galpon.entity").Galpon>;
    findAll(id_empresa: number): Promise<import("./entities/galpon.entity").Galpon[]>;
    findAllIncludingInactive(): Promise<import("./entities/galpon.entity").Galpon[]>;
    findOne(id: string): Promise<import("./entities/galpon.entity").Galpon>;
    update(id: string, updateGalponDto: UpdateGalponDto): Promise<import("./entities/galpon.entity").Galpon>;
    inactivate(id: string): Promise<{
        message: string;
    }>;
    reactivate(id: string): Promise<{
        message: string;
    }>;
}
