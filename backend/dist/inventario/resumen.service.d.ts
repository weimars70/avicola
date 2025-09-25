import { Repository } from 'typeorm';
import { EntradaProduccion } from '../entradas-produccion/entities/entrada-produccion.entity';
import { Salida } from '../salidas/entities/salida.entity';
import { Inventario } from './entities/inventario.entity';
export declare class ResumenService {
    private entradasRepository;
    private salidasRepository;
    private inventarioRepository;
    constructor(entradasRepository: Repository<EntradaProduccion>, salidasRepository: Repository<Salida>, inventarioRepository: Repository<Inventario>);
    getInventarioResumen(galponId?: string, tipoHuevoId?: string): Promise<any[]>;
}
