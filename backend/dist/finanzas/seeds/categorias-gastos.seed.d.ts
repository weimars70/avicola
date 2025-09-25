import { Repository } from 'typeorm';
import { CategoriaGasto } from '../entities/categoria-gasto.entity';
export declare class CategoriasGastosSeed {
    private categoriasRepository;
    constructor(categoriasRepository: Repository<CategoriaGasto>);
    seed(): Promise<void>;
}
