import { RendimientoService } from './rendimiento.service';
import { CreateRendimientoDto } from './dto/create-rendimiento.dto';
import { UpdateRendimientoDto } from './dto/update-rendimiento.dto';
export declare class RendimientoController {
    private readonly rendimientoService;
    constructor(rendimientoService: RendimientoService);
    create(createRendimientoDto: CreateRendimientoDto): Promise<import("./entities/rendimiento.entity").Rendimiento>;
    findAll(): Promise<import("./entities/rendimiento.entity").Rendimiento[]>;
    getMetricasRendimiento(): Promise<any>;
    findByDateRange(fechaInicio: string, fechaFin: string): Promise<import("./entities/rendimiento.entity").Rendimiento[]>;
    findByPeriodo(periodo: string): Promise<import("./entities/rendimiento.entity").Rendimiento[]>;
    calcularRendimientoDiario(fecha: string, id_empresa: number): Promise<import("./entities/rendimiento.entity").Rendimiento>;
    calcularRendimientoMensual(año: number, mes: number, id_empresa: number): Promise<import("./entities/rendimiento.entity").Rendimiento>;
    findOne(id: string): Promise<import("./entities/rendimiento.entity").Rendimiento>;
    update(id: string, updateRendimientoDto: UpdateRendimientoDto): Promise<import("./entities/rendimiento.entity").Rendimiento>;
    remove(id: string): Promise<void>;
}
