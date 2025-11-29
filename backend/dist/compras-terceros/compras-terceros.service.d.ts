import { Repository } from 'typeorm';
import { Compra } from './entities/compra.entity';
import { DetalleCompra } from './entities/detalle-compra.entity';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { GastosService } from '../finanzas/gastos.service';
import { CategoriasGastosService } from '../finanzas/categorias-gastos.service';
import { InventarioTerceros } from '../inventario-terceros/entities/inventario-terceros.entity';
import { Canasta } from '../canastas/entities/canasta.entity';
import { Tercero } from '../terceros/entities/tercero.entity';
export declare class ComprasTercerosService {
    private comprasRepository;
    private detallesRepository;
    private invTercerosRepo;
    private canastasRepo;
    private tercerosRepo;
    private gastosService;
    private categoriasService;
    constructor(comprasRepository: Repository<Compra>, detallesRepository: Repository<DetalleCompra>, invTercerosRepo: Repository<InventarioTerceros>, canastasRepo: Repository<Canasta>, tercerosRepo: Repository<Tercero>, gastosService: GastosService, categoriasService: CategoriasGastosService);
    create(createCompraDto: CreateCompraDto, idEmpresa: number, idUsuario: string): Promise<Compra>;
    findAll(idEmpresa: number): Promise<Compra[]>;
    findOne(id: string, idEmpresa: number): Promise<Compra>;
    update(id: string, updateCompraDto: UpdateCompraDto, idEmpresa: number): Promise<Compra>;
    remove(id: string, idEmpresa: number): Promise<{
        message: string;
    }>;
    getEstadisticas(idEmpresa: number): Promise<{
        totalCompras: number;
        totalGastado: number;
        comprasPendientes: number;
        totalPendiente: number;
        promedioCompra: number;
    }>;
    private ensureCategoriaComprasTerceros;
    private createGastoDesdeCompra;
    private syncGastoDesdeCompra;
    private getStockActualTerceros;
}
