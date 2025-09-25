import { Repository } from 'typeorm';
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
    constructor(salidasRepository: Repository<Salida>, tiposHuevoService: TiposHuevoService, canastasService: CanastasService, inventarioStockService: InventarioStockService, ingresosService: IngresosService);
    create(createSalidaDto: CreateSalidaDto): Promise<Salida>;
    findAll(): Promise<Salida[]>;
    findOne(id: string): Promise<Salida>;
    update(id: string, updateSalidaDto: UpdateSalidaDto): Promise<Salida>;
    remove(id: string): Promise<void>;
    getSalidasDiarias(fechaInicio: string, fechaFin: string): Promise<any[]>;
    getCanastasDiarias(fechaInicio: string, fechaFin: string): Promise<any[]>;
}
