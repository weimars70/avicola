import { SalidasService } from './salidas.service';
import { CreateSalidaDto } from './dto/create-salida.dto';
import { UpdateSalidaDto } from './dto/update-salida.dto';
export declare class SalidasController {
    private readonly salidasService;
    constructor(salidasService: SalidasService);
    create(createSalidaDto: CreateSalidaDto): Promise<import("./entities/salida.entity").Salida>;
    findAll(): Promise<import("./entities/salida.entity").Salida[]>;
    findOne(id: string): Promise<import("./entities/salida.entity").Salida>;
    update(id: string, updateSalidaDto: UpdateSalidaDto): Promise<import("./entities/salida.entity").Salida>;
    remove(id: string): Promise<void>;
}
