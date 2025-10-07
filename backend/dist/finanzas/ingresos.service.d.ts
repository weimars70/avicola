import { Repository } from 'typeorm';
import { Ingreso } from './entities/ingreso.entity';
import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { UpdateIngresoDto } from './dto/update-ingreso.dto';
import { SalidasService } from '../salidas/salidas.service';
export declare class IngresosService {
    private ingresosRepository;
    private salidasService;
    constructor(ingresosRepository: Repository<Ingreso>, salidasService: SalidasService);
    create(createIngresoDto: CreateIngresoDto): Promise<Ingreso>;
    findAll(): Promise<Ingreso[]>;
    findAllIncludingInactive(): Promise<Ingreso[]>;
    findOne(id: string): Promise<Ingreso>;
    findByDateRange(fechaInicio: string, fechaFin: string): Promise<Ingreso[]>;
    findByTipo(tipo: string): Promise<Ingreso[]>;
    update(id: string, updateIngresoDto: UpdateIngresoDto): Promise<Ingreso>;
    remove(id: string): Promise<void>;
    getTotalIngresos(id_empresa: number): Promise<number>;
    getTotalIngresosByDateRange(fechaInicio: string, fechaFin: string): Promise<number>;
    getTotalIngresosByTipo(): Promise<any[]>;
    syncIngresosFromSalidas(id_empresa: number): Promise<Ingreso[]>;
    getIngresosDiarios(fechaInicio: string, fechaFin: string): Promise<any[]>;
}
