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
    create(createAjusteDto: CreateAjusteInventarioDto, id_empresa?: number): Promise<AjusteInventario>;
    findAll(id_empresa: number): Promise<AjusteInventario[]>;
    findByTipoHuevo(tipoHuevoId: string, id_empresa: number): Promise<AjusteInventario[]>;
    findOne(id: string): Promise<AjusteInventario>;
    createLote(createAjusteLoteDto: CreateAjusteLoteDto, id_empresa: number): Promise<AjusteLote>;
    findAllLotes(id_empresa: number): Promise<AjusteLote[]>;
    findOneLote(id: string): Promise<AjusteLote>;
    updateLote(id: string, updateAjusteLoteDto: UpdateAjusteLoteDto): Promise<AjusteLote>;
    removeLote(id: string): Promise<void>;
    update(id: string, updateAjusteDto: CreateAjusteInventarioDto): Promise<AjusteInventario>;
    remove(id: string): Promise<void>;
}
