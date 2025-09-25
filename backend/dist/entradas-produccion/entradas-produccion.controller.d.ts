import { EntradasProduccionService } from './entradas-produccion.service';
import { CreateEntradaProduccionDto } from './dto/create-entrada-produccion.dto';
import { UpdateEntradaProduccionDto } from './dto/update-entrada-produccion.dto';
import { CreateEntradasMasivasDto } from './dto/create-entradas-masivas.dto';
export declare class EntradasProduccionController {
    private readonly entradasProduccionService;
    constructor(entradasProduccionService: EntradasProduccionService);
    create(createEntradaProduccionDto: CreateEntradaProduccionDto): Promise<import("./entities/entrada-produccion.entity").EntradaProduccion>;
    createMasivas(createEntradasMasivasDto: CreateEntradasMasivasDto): Promise<import("./entities/entrada-produccion.entity").EntradaProduccion[]>;
    findAll(): Promise<import("./entities/entrada-produccion.entity").EntradaProduccion[]>;
    findOne(id: string): Promise<import("./entities/entrada-produccion.entity").EntradaProduccion>;
    update(id: string, updateEntradaProduccionDto: UpdateEntradaProduccionDto): Promise<import("./entities/entrada-produccion.entity").EntradaProduccion>;
    remove(id: string): Promise<void>;
}
