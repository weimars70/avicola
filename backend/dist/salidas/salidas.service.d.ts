import { Repository, DataSource } from 'typeorm';
import { CreateSalidaDto } from './dto/create-salida.dto';
import { UpdateSalidaDto } from './dto/update-salida.dto';
import { Salida } from './entities/salida.entity';
import { TiposHuevoService } from '../tipos-huevo/tipos-huevo.service';
import { CanastasService } from '../canastas/canastas.service';
import { InventarioStockService } from '../inventario/inventario-stock.service';
import { IngresosService } from '../finanzas/ingresos.service';
export declare class SalidasService {
    private salidasRepository;
    private tiposHuevoService;
    private canastasService;
    private inventarioStockService;
    private ingresosService;
    private dataSource;
    constructor(salidasRepository: Repository<Salida>, tiposHuevoService: TiposHuevoService, canastasService: CanastasService, inventarioStockService: InventarioStockService, ingresosService: IngresosService, dataSource: DataSource);
    create(createSalidaDto: CreateSalidaDto, id_empresa: number): Promise<Salida>;
    findAll(id_empresa: number): Promise<Salida[]>;
    findOne(id: string, id_empresa: number): Promise<Salida>;
    update(id: string, updateSalidaDto: UpdateSalidaDto, id_empresa: number): Promise<Salida>;
    remove(id: string, id_empresa: number): Promise<void>;
    getSalidasDiarias(fechaInicio: string, fechaFin: string, id_empresa?: number): Promise<any[]>;
    getCanastasDiarias(fechaInicio: string, fechaFin: string, id_empresa?: number): Promise<any[]>;
}
