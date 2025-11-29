import { Repository } from 'typeorm';
import { EntradaProduccion } from '../entradas-produccion/entities/entrada-produccion.entity';
import { Salida } from '../salidas/entities/salida.entity';
import { Inventario } from './entities/inventario.entity';
import { InventarioTerceros } from '../inventario-terceros/entities/inventario-terceros.entity';
import { Canasta } from '../canastas/entities/canasta.entity';
export declare class ResumenService {
    private entradasRepository;
    private salidasRepository;
    private inventarioRepository;
    private invTercerosRepository;
    private canastasRepository;
    constructor(entradasRepository: Repository<EntradaProduccion>, salidasRepository: Repository<Salida>, inventarioRepository: Repository<Inventario>, invTercerosRepository: Repository<InventarioTerceros>, canastasRepository: Repository<Canasta>);
    getInventarioResumen(galponId?: string, tipoHuevoId?: string, id_empresa?: number): Promise<any[]>;
    getInventarioTercerosResumen(id_empresa: number, id_tercero?: number): Promise<{
        canasta: Canasta | {
            id: any;
            nombre: string;
            unidadesPorCanasta: number;
        };
        stockActual: number;
    }[]>;
}
