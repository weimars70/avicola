import { CategoriasGastosService } from './categorias-gastos.service';
import { CreateCategoriaGastoDto } from './dto/create-categoria-gasto.dto';
import { UpdateCategoriaGastoDto } from './dto/update-categoria-gasto.dto';
export declare class CategoriasGastosController {
    private readonly categoriasGastosService;
    constructor(categoriasGastosService: CategoriasGastosService);
    create(createCategoriaGastoDto: CreateCategoriaGastoDto): Promise<import("./entities/categoria-gasto.entity").CategoriaGasto>;
    findAll(): Promise<import("./entities/categoria-gasto.entity").CategoriaGasto[]>;
    findAllIncludingInactive(): Promise<import("./entities/categoria-gasto.entity").CategoriaGasto[]>;
    findOne(id: string): Promise<import("./entities/categoria-gasto.entity").CategoriaGasto>;
    update(id: string, updateCategoriaGastoDto: UpdateCategoriaGastoDto): Promise<import("./entities/categoria-gasto.entity").CategoriaGasto>;
    remove(id: string): Promise<void>;
    seedCategorias(): Promise<{
        message: string;
        categorias: import("./entities/categoria-gasto.entity").CategoriaGasto[];
    }>;
}
