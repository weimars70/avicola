import { ComprasTercerosService } from './compras-terceros.service';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
export declare class ComprasTercerosController {
    private readonly comprasTercerosService;
    constructor(comprasTercerosService: ComprasTercerosService);
    create(createCompraDto: CreateCompraDto, req: any): Promise<import("./entities/compra.entity").Compra>;
    findAll(idEmpresa: number): Promise<import("./entities/compra.entity").Compra[]>;
    getEstadisticas(idEmpresa: number): Promise<{
        totalCompras: number;
        totalGastado: number;
        comprasPendientes: number;
        totalPendiente: number;
        promedioCompra: number;
    }>;
    findOne(id: string, idEmpresa: number): Promise<import("./entities/compra.entity").Compra>;
    update(id: string, updateCompraDto: UpdateCompraDto, idEmpresa: number): Promise<import("./entities/compra.entity").Compra>;
    remove(id: string, idEmpresa: number): Promise<{
        message: string;
    }>;
}
