import { CanastasService } from './canastas.service';
import { CreateCanastaDto } from './dto/create-canasta.dto';
import { UpdateCanastaDto } from './dto/update-canasta.dto';
export declare class CanastasController {
    private readonly canastasService;
    constructor(canastasService: CanastasService);
    create(createCanastaDto: CreateCanastaDto): Promise<import("./entities/canasta.entity").Canasta>;
    findAll(): Promise<import("./entities/canasta.entity").Canasta[]>;
    findAllIncludingInactive(): Promise<import("./entities/canasta.entity").Canasta[]>;
    findOne(id: string): Promise<import("./entities/canasta.entity").Canasta>;
    update(id: string, updateCanastaDto: UpdateCanastaDto): Promise<import("./entities/canasta.entity").Canasta>;
    remove(id: string): Promise<void>;
}
