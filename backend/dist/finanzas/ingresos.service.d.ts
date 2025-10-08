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
    findAll(id_empresa: number): Promise<Ingreso[]>;
    findAllIncludingInactive(id_empresa: number): Promise<Ingreso[]>;
    findOne(id: string): Promise<Ingreso>;
    findByDateRange(fechaInicio: string, fechaFin: string, id_empresa: number): Promise<Ingreso[]>;
    findByTipo(tipo: string, id_empresa: number): Promise<Ingreso[]>;
    update(id: string, updateIngresoDto: UpdateIngresoDto): Promise<Ingreso>;
    remove(id: string): Promise<void>;
    getTotalIngresos(id_empresa: number): Promise<number>;
    getTotalIngresosByDateRange(fechaInicio: string, fechaFin: string, id_empresa: number): Promise<number>;
    getTotalIngresosByTipo(id_empresa: number): Promise<any[]>;
    syncIngresosFromSalidas(id_empresa: number): Promise<Ingreso[]>;
    getIngresosDiarios(fechaInicio: string, fechaFin: string, id_empresa?: number): Promise<any[]>;
}
