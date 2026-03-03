import { MovimientosGalponService } from './movimientos-galpon.service';
import { CreateDetalleGalponDto } from './dto/create-detalle-galpon.dto';
import { UpdateDetalleGalponDto } from './dto/update-detalle-galpon.dto';
export declare class MovimientosGalponController {
    private readonly movimientosService;
    private readonly logger;
    constructor(movimientosService: MovimientosGalponService);
    create(createDto: CreateDetalleGalponDto, id_empresa: number, id_usuario: string): Promise<import("./entities/detalle-galpon.entity").DetalleGalpon>;
    findByGalpon(id: string, id_empresa: number): Promise<import("./entities/detalle-galpon.entity").DetalleGalpon[]>;
    findOne(id: string, id_empresa: number): Promise<import("./entities/detalle-galpon.entity").DetalleGalpon>;
    update(id: string, updateDto: UpdateDetalleGalponDto, id_empresa: number, id_usuario: string): Promise<import("./entities/detalle-galpon.entity").DetalleGalpon>;
    remove(id: string, id_empresa: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getPoblacion(id: string, id_empresa: number): Promise<{
        poblacion: number;
    }>;
}
