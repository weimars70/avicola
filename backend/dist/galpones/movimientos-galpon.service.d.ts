import { Repository } from 'typeorm';
import { DetalleGalpon } from './entities/detalle-galpon.entity';
import { CreateDetalleGalponDto } from './dto/create-detalle-galpon.dto';
import { UpdateDetalleGalponDto } from './dto/update-detalle-galpon.dto';
import { Galpon } from './entities/galpon.entity';
export declare class MovimientosGalponService {
    private detallesRepository;
    private galponesRepository;
    private readonly logger;
    constructor(detallesRepository: Repository<DetalleGalpon>, galponesRepository: Repository<Galpon>);
    create(createDto: CreateDetalleGalponDto, id_empresa: number, id_usuario: string): Promise<DetalleGalpon>;
    findByGalpon(id_galpon: string, id_empresa: number): Promise<DetalleGalpon[]>;
    findOne(id: string, id_empresa: number): Promise<DetalleGalpon>;
    update(id: string, updateDto: UpdateDetalleGalponDto, id_empresa: number, id_usuario: string): Promise<DetalleGalpon>;
    remove(id: string, id_empresa: number): Promise<void>;
    getPoblacionActual(id_galpon: string, id_empresa: number): Promise<number>;
}
