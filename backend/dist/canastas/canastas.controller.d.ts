import { CanastasService } from './canastas.service';
import { CreateCanastaDto } from './dto/create-canasta.dto';
import { UpdateCanastaDto } from './dto/update-canasta.dto';
export declare class CanastasController {
    private readonly canastasService;
    constructor(canastasService: CanastasService);
    create(createCanastaDto: CreateCanastaDto, id_empresa: number, id_usuario_inserta?: string): Promise<import("./entities/canasta.entity").Canasta>;
    findAll(id_empresa: number): Promise<import("./entities/canasta.entity").Canasta[]>;
    findAllIncludingInactive(id_empresa: number): Promise<import("./entities/canasta.entity").Canasta[]>;
    findOne(id: string, id_empresa: number): Promise<import("./entities/canasta.entity").Canasta>;
    update(id: string, id_empresa: number, updateCanastaDto: UpdateCanastaDto, id_usuario_actualiza?: string): Promise<import("./entities/canasta.entity").Canasta>;
    remove(id: string, id_empresa: number): Promise<void>;
}
