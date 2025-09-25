import { GastosService } from './gastos.service';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { CreateConsumoPropioDto } from './dto/create-consumo-propio.dto';
export declare class GastosController {
    private readonly gastosService;
    constructor(gastosService: GastosService);
    create(createGastoDto: CreateGastoDto): Promise<import("./entities/gasto.entity").Gasto>;
    createConsumoPropio(createConsumoPropioDto: CreateConsumoPropioDto): Promise<import("./entities/gasto.entity").Gasto>;
    findAll(): Promise<import("./entities/gasto.entity").Gasto[]>;
    findAllIncludingInactive(): Promise<import("./entities/gasto.entity").Gasto[]>;
    findByDateRange(fechaInicio: string, fechaFin: string): Promise<import("./entities/gasto.entity").Gasto[]>;
    findByCategoria(categoriaId: string): Promise<import("./entities/gasto.entity").Gasto[]>;
    getTotalGastos(): Promise<number>;
    getTotalGastosByDateRange(fechaInicio: string, fechaFin: string): Promise<number>;
    getTotalGastosByCategoria(): Promise<any[]>;
    findOne(id: string): Promise<import("./entities/gasto.entity").Gasto>;
    update(id: string, updateGastoDto: UpdateGastoDto): Promise<import("./entities/gasto.entity").Gasto>;
    remove(id: string): Promise<void>;
}
