import { IngresosService } from './ingresos.service';
import { CreateIngresoDto } from './dto/create-ingreso.dto';
import { UpdateIngresoDto } from './dto/update-ingreso.dto';
export declare class IngresosController {
    private readonly ingresosService;
    constructor(ingresosService: IngresosService);
    create(createIngresoDto: CreateIngresoDto): Promise<import("./entities/ingreso.entity").Ingreso>;
    findAll(id_empresa: number): Promise<import("./entities/ingreso.entity").Ingreso[]>;
    findAllIncludingInactive(id_empresa: number): Promise<import("./entities/ingreso.entity").Ingreso[]>;
    findByDateRange(id_empresa: number): Promise<import("./entities/ingreso.entity").Ingreso[]>;
    findByTipo(tipo: string, id_empresa: number): Promise<import("./entities/ingreso.entity").Ingreso[]>;
    getTotalIngresos(id_empresa: number): Promise<number>;
    getTotalIngresosByDateRange(id_empresa: number): Promise<number>;
    getTotalIngresosByTipo(id_empresa: number): Promise<any[]>;
    syncIngresosFromSalidas(id_empresa: number): Promise<import("./entities/ingreso.entity").Ingreso[]>;
    findOne(id: string): Promise<import("./entities/ingreso.entity").Ingreso>;
    update(id: string, updateIngresoDto: UpdateIngresoDto): Promise<import("./entities/ingreso.entity").Ingreso>;
    remove(id: string): Promise<void>;
}
