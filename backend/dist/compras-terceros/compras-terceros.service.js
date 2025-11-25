"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComprasTercerosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const compra_entity_1 = require("./entities/compra.entity");
const detalle_compra_entity_1 = require("./entities/detalle-compra.entity");
const gastos_service_1 = require("../finanzas/gastos.service");
const categorias_gastos_service_1 = require("../finanzas/categorias-gastos.service");
let ComprasTercerosService = class ComprasTercerosService {
    constructor(comprasRepository, detallesRepository, gastosService, categoriasService) {
        this.comprasRepository = comprasRepository;
        this.detallesRepository = detallesRepository;
        this.gastosService = gastosService;
        this.categoriasService = categoriasService;
    }
    async create(createCompraDto, idEmpresa, idUsuario) {
        const total = createCompraDto.detalles.reduce((sum, detalle) => sum + (detalle.cantidad * detalle.precioUnitario), 0);
        const compra = this.comprasRepository.create(Object.assign(Object.assign({}, createCompraDto), { total, tipoMovimiento: 2 }));
        compra.idEmpresa = idEmpresa;
        compra.idUsuarioInserta = idUsuario;
        const savedCompra = await this.comprasRepository.save(compra);
        const detalles = createCompraDto.detalles.map(detalle => this.detallesRepository.create(Object.assign(Object.assign({}, detalle), { idCompra: savedCompra.id, tipoMovimiento: 2 })));
        await this.detallesRepository.save(detalles);
        const compraCompleta = await this.findOne(savedCompra.id, idEmpresa);
        await this.createGastoDesdeCompra(compraCompleta, idEmpresa, idUsuario);
        return compraCompleta;
    }
    async findAll(idEmpresa) {
        return await this.comprasRepository.find({
            where: { idEmpresa, tipoMovimiento: 2, activo: true },
            relations: ['tercero', 'detalles'],
            order: { fecha: 'DESC' },
        });
    }
    async findOne(id, idEmpresa) {
        const compra = await this.comprasRepository.findOne({
            where: { id, idEmpresa, activo: true },
            relations: ['tercero', 'detalles'],
        });
        if (!compra) {
            throw new common_1.NotFoundException(`Compra con ID ${id} no encontrada`);
        }
        return compra;
    }
    async update(id, updateCompraDto, idEmpresa) {
        const compra = await this.comprasRepository.findOne({ where: { id, idEmpresa, activo: true }, relations: ['tercero'] });
        if (!compra) {
            throw new common_1.NotFoundException(`Compra con ID ${id} no encontrada`);
        }
        if (updateCompraDto.detalles && updateCompraDto.detalles.length > 0) {
            const total = updateCompraDto.detalles.reduce((sum, detalle) => sum + (detalle.cantidad * detalle.precioUnitario), 0);
            updateCompraDto['total'] = total;
            await this.detallesRepository.delete({ idCompra: id });
            const nuevosDetalles = updateCompraDto.detalles.map(detalle => this.detallesRepository.create(Object.assign(Object.assign({}, detalle), { idCompra: id, tipoMovimiento: 2 })));
            await this.detallesRepository.save(nuevosDetalles);
        }
        Object.assign(compra, updateCompraDto);
        await this.comprasRepository.save(compra);
        const compraActualizada = await this.findOne(id, idEmpresa);
        await this.syncGastoDesdeCompra(compraActualizada, idEmpresa, compraActualizada.idUsuarioInserta || '');
        return compraActualizada;
    }
    async remove(id, idEmpresa) {
        const compra = await this.findOne(id, idEmpresa);
        compra.activo = false;
        await this.comprasRepository.save(compra);
        try {
            const gastos = await this.gastosService.findAll(idEmpresa);
            const gastoRelacionado = gastos.find(g => { var _a; return (g.numeroFactura || '') === (compra.numeroFactura || '') && (g.proveedor || '') === (((_a = compra.tercero) === null || _a === void 0 ? void 0 : _a.nombre) || ''); });
            if (gastoRelacionado) {
                await this.gastosService.remove(gastoRelacionado.id);
            }
        }
        catch (_a) { }
        return { message: 'Compra eliminada correctamente' };
    }
    async getEstadisticas(idEmpresa) {
        const compras = await this.findAll(idEmpresa);
        const totalCompras = compras.length;
        const totalGastado = compras.reduce((sum, c) => sum + Number(c.total), 0);
        const comprasPendientes = 0;
        const totalPendiente = 0;
        return {
            totalCompras,
            totalGastado,
            comprasPendientes,
            totalPendiente,
            promedioCompra: totalCompras > 0 ? totalGastado / totalCompras : 0,
        };
    }
    async ensureCategoriaComprasTerceros() {
        const categorias = await this.categoriasService.findAll();
        const existente = categorias.find(c => c.nombre === 'Compras de Terceros');
        if (existente)
            return existente.id;
        const creada = await this.categoriasService.create({ nombre: 'Compras de Terceros', descripcion: 'Compras realizadas a terceros', color: '#764ba2' });
        return creada.id;
    }
    async createGastoDesdeCompra(compra, idEmpresa, idUsuario) {
        var _a, _b;
        try {
            const categoriaId = await this.ensureCategoriaComprasTerceros();
            const gastoDto = {
                descripcion: `Compra terceros ${((_a = compra.tercero) === null || _a === void 0 ? void 0 : _a.nombre) || ''}`.trim(),
                monto: Number(compra.total),
                fecha: compra.fecha,
                observaciones: `[origen=terceros]`,
                numeroFactura: compra.numeroFactura || undefined,
                proveedor: ((_b = compra.tercero) === null || _b === void 0 ? void 0 : _b.nombre) || undefined,
                categoriaId,
                id_empresa: idEmpresa,
                id_usuario_inserta: idUsuario,
                activo: true,
            };
            const existentes = await this.gastosService.findAll(idEmpresa);
            const yaExiste = existentes.some(g => (g.numeroFactura || '') === (compra.numeroFactura || '') && Number(g.monto) === Number(compra.total) && g.fecha.toISOString().startsWith(compra.fecha));
            if (!yaExiste) {
                await this.gastosService.create(gastoDto);
            }
        }
        catch (e) {
        }
    }
    async syncGastoDesdeCompra(compra, idEmpresa, idUsuario) {
        var _a;
        try {
            const gastos = await this.gastosService.findAll(idEmpresa);
            const gastoRelacionado = gastos.find(g => { var _a; return (g.numeroFactura || '') === (compra.numeroFactura || '') && (g.proveedor || '') === (((_a = compra.tercero) === null || _a === void 0 ? void 0 : _a.nombre) || ''); });
            if (gastoRelacionado) {
                await this.gastosService.update(gastoRelacionado.id, {
                    descripcion: `Compra terceros ${((_a = compra.tercero) === null || _a === void 0 ? void 0 : _a.nombre) || ''}`.trim(),
                    monto: Number(compra.total),
                    fecha: compra.fecha,
                    observaciones: `[origen=terceros]`,
                    categoriaId: gastoRelacionado.categoriaId,
                });
            }
            else {
                await this.createGastoDesdeCompra(compra, idEmpresa, idUsuario);
            }
        }
        catch (_b) { }
    }
};
exports.ComprasTercerosService = ComprasTercerosService;
exports.ComprasTercerosService = ComprasTercerosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(compra_entity_1.Compra)),
    __param(1, (0, typeorm_1.InjectRepository)(detalle_compra_entity_1.DetalleCompra)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        gastos_service_1.GastosService,
        categorias_gastos_service_1.CategoriasGastosService])
], ComprasTercerosService);
//# sourceMappingURL=compras-terceros.service.js.map