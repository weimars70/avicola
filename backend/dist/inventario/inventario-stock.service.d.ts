import { Repository } from 'typeorm';
import { Inventario } from './entities/inventario.entity';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
export declare class InventarioStockService {
    private inventarioRepository;
    constructor(inventarioRepository: Repository<Inventario>);
    create(createInventarioDto: CreateInventarioDto): Promise<Inventario>;
    findAll(id_empresa: number): Promise<Inventario[]>;
    findByTipoHuevo(tipoHuevoId: string, id_empresa: number): Promise<Inventario | null>;
    findOne(id: number): Promise<Inventario>;
    update(id: number, updateInventarioDto: UpdateInventarioDto): Promise<Inventario>;
    remove(id: number): Promise<void>;
    actualizarInventario(tipoHuevoId: string, unidadesAgregar: number, id_empresa?: number): Promise<Inventario>;
    reducirInventario(tipoHuevoId: string, unidadesReducir: number, id_empresa?: number): Promise<Inventario>;
    aumentarStock(tipoHuevoId: string, unidadesAumentar: number, id_empresa?: number): Promise<Inventario>;
    reducirStock(tipoHuevoId: string, unidadesReducir: number, id_empresa?: number): Promise<Inventario>;
    getVistaInventario(id_empresa: number): Promise<any[]>;
}
