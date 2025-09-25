import { Repository } from 'typeorm';
import { Inventario } from './entities/inventario.entity';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';
export declare class InventarioStockService {
    private inventarioRepository;
    constructor(inventarioRepository: Repository<Inventario>);
    create(createInventarioDto: CreateInventarioDto): Promise<Inventario>;
    findAll(): Promise<Inventario[]>;
    findByTipoHuevo(tipoHuevoId: string): Promise<Inventario | null>;
    findOne(id: number): Promise<Inventario>;
    update(id: number, updateInventarioDto: UpdateInventarioDto): Promise<Inventario>;
    remove(id: number): Promise<void>;
    actualizarInventario(tipoHuevoId: string, unidadesAgregar: number): Promise<Inventario>;
    reducirInventario(tipoHuevoId: string, unidadesReducir: number): Promise<Inventario>;
    aumentarStock(tipoHuevoId: string, unidadesAumentar: number): Promise<Inventario>;
    reducirStock(tipoHuevoId: string, unidadesReducir: number): Promise<Inventario>;
    getVistaInventario(): Promise<any[]>;
}
