import { Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { IngresosService } from '../finanzas/ingresos.service';
import { InventarioTerceros } from '../inventario-terceros/entities/inventario-terceros.entity';
import { Canasta } from '../canastas/entities/canasta.entity';
import { Salida } from '../salidas/entities/salida.entity';
import { Inventario } from '../inventario/entities/inventario.entity';
export declare class VentasTercerosService {
    private ventasRepository;
    private detallesRepository;
    private invTercerosRepo;
    private canastasRepo;
    private salidasRepo;
    private inventarioRepo;
    private ingresosService;
    constructor(ventasRepository: Repository<Venta>, detallesRepository: Repository<DetalleVenta>, invTercerosRepo: Repository<InventarioTerceros>, canastasRepo: Repository<Canasta>, salidasRepo: Repository<Salida>, inventarioRepo: Repository<Inventario>, ingresosService: IngresosService);
    create(createVentaDto: CreateVentaDto, idEmpresa: number, idUsuario: string): Promise<Venta>;
    findAll(idEmpresa: number): Promise<Venta[]>;
    findOne(id: string, idEmpresa: number): Promise<Venta>;
    update(id: string, updateVentaDto: UpdateVentaDto, idEmpresa: number): Promise<Venta>;
    remove(id: string, idEmpresa: number): Promise<{
        message: string;
    }>;
    getEstadisticas(idEmpresa: number): Promise<{
        totalVentas: number;
        totalIngresado: number;
        ventasPendientes: number;
        totalPendiente: number;
        ventasPagadas: number;
        totalPagado: number;
        promedioVenta: number;
    }>;
    private createIngresoDesdeVenta;
    private syncIngresoDesdeVenta;
    private getStockActualTerceros;
    private getStockActualTercerosWithRepo;
}
