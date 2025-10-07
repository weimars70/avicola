import { InventarioStockService } from './inventario-stock.service';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
export declare class InventarioStockController {
    private readonly inventarioStockService;
    constructor(inventarioStockService: InventarioStockService);
    create(createInventarioDto: CreateInventarioDto): Promise<import("./entities/inventario.entity").Inventario>;
    findAll(id_empresa: number): Promise<import("./entities/inventario.entity").Inventario[]>;
    getVistaInventario(): Promise<any[]>;
    findByTipoHuevo(tipoHuevoId: string): Promise<import("./entities/inventario.entity").Inventario>;
    findOne(id: number): Promise<import("./entities/inventario.entity").Inventario>;
    update(id: number, updateInventarioDto: UpdateInventarioDto): Promise<import("./entities/inventario.entity").Inventario>;
    remove(id: number): Promise<void>;
}
