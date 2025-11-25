import { TercerosService } from './terceros.service';
import { CreateTerceroDto, UpdateTerceroDto } from './dto/create-tercero.dto';
export declare class TercerosController {
    private readonly tercerosService;
    constructor(tercerosService: TercerosService);
    create(createTerceroDto: CreateTerceroDto, idEmpresa: number): Promise<import("./entities/tercero.entity").Tercero>;
    findAll(idEmpresa: number): Promise<import("./entities/tercero.entity").Tercero[]>;
    findActivos(idEmpresa: number): Promise<import("./entities/tercero.entity").Tercero[]>;
    findClientes(idEmpresa: number): Promise<import("./entities/tercero.entity").Tercero[]>;
    findProveedores(idEmpresa: number): Promise<import("./entities/tercero.entity").Tercero[]>;
    buscarPorIdentificacion(identificacion: string, idEmpresa: number): Promise<import("./entities/tercero.entity").Tercero[]>;
    buscarPorNombre(nombre: string, idEmpresa: number): Promise<import("./entities/tercero.entity").Tercero[]>;
    findOne(codigo: number, idEmpresa: number): Promise<import("./entities/tercero.entity").Tercero>;
    update(codigo: number, updateTerceroDto: UpdateTerceroDto, idEmpresa: number): Promise<import("./entities/tercero.entity").Tercero>;
    remove(codigo: number, idEmpresa: number): Promise<void>;
}
