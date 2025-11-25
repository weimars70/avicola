import { VentasTercerosService } from './ventas-terceros.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
export declare class VentasTercerosController {
    private readonly ventasTercerosService;
    constructor(ventasTercerosService: VentasTercerosService);
    create(createVentaDto: CreateVentaDto, req: any): Promise<import("./entities/venta.entity").Venta>;
    findAll(idEmpresa: number): Promise<import("./entities/venta.entity").Venta[]>;
    getEstadisticas(idEmpresa: number): Promise<{
        totalVentas: number;
        totalIngresado: number;
        ventasPendientes: number;
        totalPendiente: number;
        ventasPagadas: number;
        totalPagado: number;
        promedioVenta: number;
    }>;
    findOne(id: string, idEmpresa: number): Promise<import("./entities/venta.entity").Venta>;
    update(id: string, updateVentaDto: UpdateVentaDto, idEmpresa: number): Promise<import("./entities/venta.entity").Venta>;
    remove(id: string, idEmpresa: number): Promise<{
        message: string;
    }>;
}
