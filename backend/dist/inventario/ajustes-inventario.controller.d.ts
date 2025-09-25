import { AjustesInventarioService } from './ajustes-inventario.service';
import { CreateAjusteInventarioDto } from './dto/create-ajuste-inventario.dto';
import { CreateAjusteLoteDto } from './dto/create-ajuste-lote.dto';
import { UpdateAjusteLoteDto } from './dto/update-ajuste-lote.dto';
export declare class AjustesInventarioController {
    private readonly ajustesInventarioService;
    constructor(ajustesInventarioService: AjustesInventarioService);
    create(createAjusteDto: CreateAjusteInventarioDto): Promise<import("./entities/ajuste-inventario.entity").AjusteInventario>;
    findAll(): Promise<import("./entities/ajuste-inventario.entity").AjusteInventario[]>;
    findByTipoHuevo(tipoHuevoId: string): Promise<import("./entities/ajuste-inventario.entity").AjusteInventario[]>;
    findOne(id: string): Promise<import("./entities/ajuste-inventario.entity").AjusteInventario>;
    createLote(createAjusteLoteDto: CreateAjusteLoteDto): Promise<import("./entities/ajuste-lote.entity").AjusteLote>;
    findAllLotes(): Promise<import("./entities/ajuste-lote.entity").AjusteLote[]>;
    findOneLote(id: string): Promise<import("./entities/ajuste-lote.entity").AjusteLote>;
    updateLote(id: string, updateAjusteLoteDto: UpdateAjusteLoteDto): Promise<import("./entities/ajuste-lote.entity").AjusteLote>;
    removeLote(id: string): Promise<void>;
    update(id: string, updateAjusteDto: CreateAjusteInventarioDto): Promise<import("./entities/ajuste-inventario.entity").AjusteInventario>;
    remove(id: string): Promise<void>;
}
