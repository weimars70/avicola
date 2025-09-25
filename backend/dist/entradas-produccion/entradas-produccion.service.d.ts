import { Repository } from 'typeorm';
import { CreateEntradaProduccionDto } from './dto/create-entrada-produccion.dto';
import { UpdateEntradaProduccionDto } from './dto/update-entrada-produccion.dto';
import { CreateEntradasMasivasDto } from './dto/create-entradas-masivas.dto';
import { EntradaProduccion } from './entities/entrada-produccion.entity';
import { Galpon } from '../galpones/entities/galpon.entity';
import { TipoHuevo } from '../tipos-huevo/entities/tipo-huevo.entity';
import { InventarioStockService } from '../inventario/inventario-stock.service';
export declare class EntradasProduccionService {
    private entradasProduccionRepository;
    private galponesRepository;
    private tiposHuevoRepository;
    private inventarioStockService;
    constructor(entradasProduccionRepository: Repository<EntradaProduccion>, galponesRepository: Repository<Galpon>, tiposHuevoRepository: Repository<TipoHuevo>, inventarioStockService: InventarioStockService);
    create(createEntradaProduccionDto: CreateEntradaProduccionDto): Promise<EntradaProduccion>;
    createMasivas(createEntradasMasivasDto: CreateEntradasMasivasDto): Promise<EntradaProduccion[]>;
    findAll(): Promise<EntradaProduccion[]>;
    findByDateRange(fechaInicio: string, fechaFin: string): Promise<EntradaProduccion[]>;
    findOne(id: string): Promise<EntradaProduccion>;
    update(id: string, updateEntradaProduccionDto: UpdateEntradaProduccionDto): Promise<EntradaProduccion>;
    remove(id: string): Promise<void>;
    getProduccionDiaria(fechaInicio: string, fechaFin: string): Promise<any[]>;
}
