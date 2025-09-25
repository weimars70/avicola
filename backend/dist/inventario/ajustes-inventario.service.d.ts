import { Repository } from 'typeorm';
import { AjusteInventario } from './entities/ajuste-inventario.entity';
import { AjusteLote } from './entities/ajuste-lote.entity';
import { CreateAjusteInventarioDto } from './dto/create-ajuste-inventario.dto';
import { CreateAjusteLoteDto } from './dto/create-ajuste-lote.dto';
import { UpdateAjusteLoteDto } from './dto/update-ajuste-lote.dto';
import { InventarioStockService } from './inventario-stock.service';
import { TiposHuevoService } from '../tipos-huevo/tipos-huevo.service';
import { UsersService } from '../users/users.service';
export declare class AjustesInventarioService {
    private ajustesRepository;
    private ajustesLoteRepository;
    private inventarioStockService;
    private tiposHuevoService;
    private usersService;
    constructor(ajustesRepository: Repository<AjusteInventario>, ajustesLoteRepository: Repository<AjusteLote>, inventarioStockService: InventarioStockService, tiposHuevoService: TiposHuevoService, usersService: UsersService);
    create(createAjusteDto: CreateAjusteInventarioDto): Promise<AjusteInventario>;
    findAll(): Promise<AjusteInventario[]>;
    findByTipoHuevo(tipoHuevoId: string): Promise<AjusteInventario[]>;
    findOne(id: string): Promise<AjusteInventario>;
    createLote(createAjusteLoteDto: CreateAjusteLoteDto): Promise<AjusteLote>;
    findAllLotes(): Promise<AjusteLote[]>;
    findOneLote(id: string): Promise<AjusteLote>;
    updateLote(id: string, updateAjusteLoteDto: UpdateAjusteLoteDto): Promise<AjusteLote>;
    removeLote(id: string): Promise<void>;
    update(id: string, updateAjusteDto: CreateAjusteInventarioDto): Promise<AjusteInventario>;
    remove(id: string): Promise<void>;
}
