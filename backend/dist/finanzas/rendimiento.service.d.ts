import { Repository } from 'typeorm';
import { Rendimiento } from './entities/rendimiento.entity';
import { CreateRendimientoDto } from './dto/create-rendimiento.dto';
import { UpdateRendimientoDto } from './dto/update-rendimiento.dto';
import { GastosService } from './gastos.service';
import { IngresosService } from './ingresos.service';
export declare class RendimientoService {
    private rendimientoRepository;
    private gastosService;
    private ingresosService;
    constructor(rendimientoRepository: Repository<Rendimiento>, gastosService: GastosService, ingresosService: IngresosService);
    create(createRendimientoDto: CreateRendimientoDto): Promise<Rendimiento>;
    findAll(): Promise<Rendimiento[]>;
    findOne(id: string): Promise<Rendimiento>;
    update(id: string, updateRendimientoDto: UpdateRendimientoDto): Promise<Rendimiento>;
    remove(id: string): Promise<void>;
    findByDateRange(fechaInicio: string, fechaFin: string): Promise<Rendimiento[]>;
    findByPeriodo(periodo: string): Promise<Rendimiento[]>;
    calcularRendimientoDiario(fecha: string): Promise<Rendimiento>;
    calcularRendimientoMensual(año: number, mes: number): Promise<Rendimiento>;
    getMetricasRendimiento(): Promise<any>;
}
