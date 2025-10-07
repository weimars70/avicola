import { IngresosService } from './ingresos.service';
import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { UpdateIngresoDto } from './dto/update-ingreso.dto';
export declare class IngresosController {
    private readonly ingresosService;
    constructor(ingresosService: IngresosService);
    create(createIngresoDto: CreateIngresoDto): Promise<import("./entities/ingreso.entity").Ingreso>;
    findAll(): Promise<import("./entities/ingreso.entity").Ingreso[]>;
    findAllIncludingInactive(): Promise<import("./entities/ingreso.entity").Ingreso[]>;
    findByDateRange(fechaInicio: string, fechaFin: string): Promise<import("./entities/ingreso.entity").Ingreso[]>;
    findByTipo(tipo: string): Promise<import("./entities/ingreso.entity").Ingreso[]>;
    getTotalIngresos(): Promise<number>;
    getTotalIngresosByDateRange(fechaInicio: string, fechaFin: string): Promise<number>;
    getTotalIngresosByTipo(): Promise<any[]>;
    syncIngresosFromSalidas(id_empresa: number): Promise<import("./entities/ingreso.entity").Ingreso[]>;
    findOne(id: string): Promise<import("./entities/ingreso.entity").Ingreso>;
    update(id: string, updateIngresoDto: UpdateIngresoDto): Promise<import("./entities/ingreso.entity").Ingreso>;
    remove(id: string): Promise<void>;
}
