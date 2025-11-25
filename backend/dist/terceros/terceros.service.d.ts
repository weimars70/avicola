import { Repository } from 'typeorm';
import { Tercero } from './entities/tercero.entity';
import { CreateTerceroDto, UpdateTerceroDto } from './dto/create-tercero.dto';
export declare class TercerosService {
    private readonly terceroRepository;
    constructor(terceroRepository: Repository<Tercero>);
    create(idEmpresa: number, createTerceroDto: CreateTerceroDto): Promise<Tercero>;
    findAll(idEmpresa: number): Promise<Tercero[]>;
    findOne(codigo: number, idEmpresa: number): Promise<Tercero>;
    update(codigo: number, updateTerceroDto: UpdateTerceroDto, idEmpresa: number): Promise<Tercero>;
    remove(codigo: number, idEmpresa: number): Promise<void>;
    buscarPorIdentificacion(identificacion: string, idEmpresa: number): Promise<Tercero[]>;
    buscarPorNombre(nombre: string, idEmpresa: number): Promise<Tercero[]>;
    findActivos(idEmpresa: number): Promise<Tercero[]>;
    findClientes(idEmpresa: number): Promise<Tercero[]>;
    findProveedores(idEmpresa: number): Promise<Tercero[]>;
}
