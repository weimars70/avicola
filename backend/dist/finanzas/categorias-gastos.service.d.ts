import { Repository } from 'typeorm';
import { CategoriaGasto } from './entities/categoria-gasto.entity';
import { CreateCategoriaGastoDto } from './dto/create-categoria-gasto.dto';
import { UpdateCategoriaGastoDto } from './dto/update-categoria-gasto.dto';
export declare class CategoriasGastosService {
    private categoriasRepository;
    constructor(categoriasRepository: Repository<CategoriaGasto>);
    create(createCategoriaGastoDto: CreateCategoriaGastoDto): Promise<CategoriaGasto>;
    findAll(): Promise<CategoriaGasto[]>;
    findAllIncludingInactive(): Promise<CategoriaGasto[]>;
    findOne(id: string): Promise<CategoriaGasto>;
    update(id: string, updateCategoriaGastoDto: UpdateCategoriaGastoDto): Promise<CategoriaGasto>;
    remove(id: string): Promise<void>;
    seedCategorias(): Promise<{
        message: string;
        categorias: CategoriaGasto[];
    }>;
}
