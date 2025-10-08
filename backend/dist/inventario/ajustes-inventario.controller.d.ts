import { AjustesInventarioService } from './ajustes-inventario.service';
import { CreateAjusteInventarioDto } from './dto/create-ajuste-inventario.dto';
import { CreateAjusteLoteDto } from './dto/create-ajuste-lote.dto';
import { UpdateAjusteLoteDto } from './dto/update-ajuste-lote.dto';
export declare class AjustesInventarioController {
    private readonly ajustesInventarioService;
    constructor(ajustesInventarioService: AjustesInventarioService);
    create(createAjusteDto: CreateAjusteInventarioDto, id_empresa: number): Promise<import("./entities/ajuste-inventario.entity").AjusteInventario>;
    findAll(id_empresa: number): Promise<import("./entities/ajuste-inventario.entity").AjusteInventario[]>;
    findByTipoHuevo(tipoHuevoId: string, id_empresa: number): Promise<import("./entities/ajuste-inventario.entity").AjusteInventario[]>;
    findOne(id: string): Promise<import("./entities/ajuste-inventario.entity").AjusteInventario>;
    createLote(createAjusteLoteDto: CreateAjusteLoteDto, id_empresa: number): Promise<import("./entities/ajuste-lote.entity").AjusteLote>;
    findAllLotes(id_empresa: number): Promise<import("./entities/ajuste-lote.entity").AjusteLote[]>;
    findOneLote(id: string): Promise<import("./entities/ajuste-lote.entity").AjusteLote>;
    updateLote(id: string, updateAjusteLoteDto: UpdateAjusteLoteDto): Promise<import("./entities/ajuste-lote.entity").AjusteLote>;
    removeLote(id: string): Promise<void>;
    update(id: string, updateAjusteDto: CreateAjusteInventarioDto): Promise<import("./entities/ajuste-inventario.entity").AjusteInventario>;
    remove(id: string): Promise<void>;
}
