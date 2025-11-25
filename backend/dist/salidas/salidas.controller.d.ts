import { SalidasService } from './salidas.service';
import { CreateSalidaDto } from './dto/create-salida.dto';
import { UpdateSalidaDto } from './dto/update-salida.dto';
export declare class SalidasController {
    private readonly salidasService;
    constructor(salidasService: SalidasService);
    create(createSalidaDto: CreateSalidaDto, id_empresa: number): Promise<import("./entities/salida.entity").Salida>;
    findAll(id_empresa: number): Promise<import("./entities/salida.entity").Salida[]>;
    findOne(id: string, id_empresa: number): Promise<import("./entities/salida.entity").Salida>;
    update(id: string, updateSalidaDto: UpdateSalidaDto, id_empresa: number): Promise<import("./entities/salida.entity").Salida>;
    remove(id: string, id_empresa: number): Promise<void>;
}
