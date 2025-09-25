import { TiposHuevoService } from './tipos-huevo.service';
import { CreateTipoHuevoDto } from './dto/create-tipo-huevo.dto';
import { UpdateTipoHuevoDto } from './dto/update-tipo-huevo.dto';
export declare class TiposHuevoController {
    private readonly tiposHuevoService;
    constructor(tiposHuevoService: TiposHuevoService);
    create(createTipoHuevoDto: CreateTipoHuevoDto): Promise<import("./entities/tipo-huevo.entity").TipoHuevo>;
    findAll(): Promise<import("./entities/tipo-huevo.entity").TipoHuevo[]>;
    findAllIncludingInactive(): Promise<import("./entities/tipo-huevo.entity").TipoHuevo[]>;
    findOne(id: string): Promise<import("./entities/tipo-huevo.entity").TipoHuevo>;
    update(id: string, updateTipoHuevoDto: UpdateTipoHuevoDto): Promise<import("./entities/tipo-huevo.entity").TipoHuevo>;
    remove(id: string): Promise<void>;
}
