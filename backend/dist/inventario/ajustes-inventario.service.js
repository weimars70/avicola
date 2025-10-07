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
exports.AjustesInventarioService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ajuste_inventario_entity_1 = require("./entities/ajuste-inventario.entity");
const ajuste_lote_entity_1 = require("./entities/ajuste-lote.entity");
const inventario_stock_service_1 = require("./inventario-stock.service");
const tipos_huevo_service_1 = require("../tipos-huevo/tipos-huevo.service");
const users_service_1 = require("../users/users.service");
let AjustesInventarioService = class AjustesInventarioService {
    constructor(ajustesRepository, ajustesLoteRepository, inventarioStockService, tiposHuevoService, usersService) {
        this.ajustesRepository = ajustesRepository;
        this.ajustesLoteRepository = ajustesLoteRepository;
        this.inventarioStockService = inventarioStockService;
        this.tiposHuevoService = tiposHuevoService;
        this.usersService = usersService;
    }
    async create(createAjusteDto) {
        const tipoHuevo = await this.tiposHuevoService.findOne(createAjusteDto.tipoHuevoId);
        if (!tipoHuevo) {
            throw new common_1.NotFoundException(`Tipo de huevo con ID ${createAjusteDto.tipoHuevoId} no encontrado`);
        }
        const usuario = await this.usersService.findOne(createAjusteDto.usuarioId);
        if (!usuario) {
            throw new common_1.NotFoundException(`Usuario con ID ${createAjusteDto.usuarioId} no encontrado`);
        }
        const inventarioActual = await this.inventarioStockService.findByTipoHuevo(createAjusteDto.tipoHuevoId);
        const cantidadAnterior = inventarioActual ? inventarioActual.unidades : 0;
        if (createAjusteDto.tipoAjuste === 'resta' && cantidadAnterior < createAjusteDto.cantidadAjuste) {
            throw new common_1.BadRequestException(`No se puede restar ${createAjusteDto.cantidadAjuste} unidades. Stock actual: ${cantidadAnterior}`);
        }
        let cantidadNueva;
        if (createAjusteDto.tipoAjuste === 'suma') {
            cantidadNueva = cantidadAnterior + createAjusteDto.cantidadAjuste;
        }
        else {
            cantidadNueva = cantidadAnterior - createAjusteDto.cantidadAjuste;
        }
        const ajuste = this.ajustesRepository.create(Object.assign(Object.assign({}, createAjusteDto), { cantidadAnterior,
            cantidadNueva }));
        const savedAjuste = await this.ajustesRepository.save(ajuste);
        if (createAjusteDto.tipoAjuste === 'suma') {
            await this.inventarioStockService.aumentarStock(createAjusteDto.tipoHuevoId, createAjusteDto.cantidadAjuste);
        }
        else {
            await this.inventarioStockService.reducirStock(createAjusteDto.tipoHuevoId, createAjusteDto.cantidadAjuste);
        }
        return savedAjuste;
    }
    async findAll() {
        return await this.ajustesRepository.find({
            relations: ['tipoHuevo', 'usuario'],
            order: { createdAt: 'DESC' },
        });
    }
    async findByTipoHuevo(tipoHuevoId) {
        return await this.ajustesRepository.find({
            where: { tipoHuevoId },
            relations: ['tipoHuevo', 'usuario'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const ajuste = await this.ajustesRepository.findOne({
            where: { id },
            relations: ['tipoHuevo', 'usuario'],
        });
        if (!ajuste) {
            throw new common_1.NotFoundException(`Ajuste de inventario con ID ${id} no encontrado`);
        }
        return ajuste;
    }
    async createLote(createAjusteLoteDto) {
        const usuario = await this.usersService.findOne(createAjusteLoteDto.usuarioId);
        if (!usuario) {
            throw new common_1.NotFoundException(`Usuario con ID ${createAjusteLoteDto.usuarioId} no encontrado`);
        }
        const ajusteLote = this.ajustesLoteRepository.create({
            descripcionGeneral: createAjusteLoteDto.descripcionGeneral,
            usuarioId: createAjusteLoteDto.usuarioId,
        });
        const savedLote = await this.ajustesLoteRepository.save(ajusteLote);
        const ajustesCreados = [];
        for (const ajusteItem of createAjusteLoteDto.ajustes) {
            const tipoHuevo = await this.tiposHuevoService.findOne(ajusteItem.tipoHuevoId);
            if (!tipoHuevo) {
                throw new common_1.NotFoundException(`Tipo de huevo con ID ${ajusteItem.tipoHuevoId} no encontrado`);
            }
            const inventarioActual = await this.inventarioStockService.findByTipoHuevo(ajusteItem.tipoHuevoId);
            const cantidadAnterior = inventarioActual ? inventarioActual.unidades : 0;
            if (ajusteItem.tipoAjuste === 'resta' && cantidadAnterior < ajusteItem.cantidadAjuste) {
                throw new common_1.BadRequestException(`No se puede restar ${ajusteItem.cantidadAjuste} unidades de ${tipoHuevo.nombre}. Stock actual: ${cantidadAnterior}`);
            }
            let cantidadNueva;
            if (ajusteItem.tipoAjuste === 'suma') {
                cantidadNueva = cantidadAnterior + ajusteItem.cantidadAjuste;
            }
            else {
                cantidadNueva = cantidadAnterior - ajusteItem.cantidadAjuste;
            }
            const ajuste = this.ajustesRepository.create({
                tipoHuevoId: ajusteItem.tipoHuevoId,
                cantidadAjuste: ajusteItem.cantidadAjuste,
                tipoAjuste: ajusteItem.tipoAjuste,
                descripcion: ajusteItem.descripcion || createAjusteLoteDto.descripcionGeneral,
                usuarioId: createAjusteLoteDto.usuarioId,
                ajusteLoteId: savedLote.id,
                cantidadAnterior,
                cantidadNueva,
            });
            const savedAjuste = await this.ajustesRepository.save(ajuste);
            ajustesCreados.push(savedAjuste);
            if (ajusteItem.tipoAjuste === 'suma') {
                await this.inventarioStockService.aumentarStock(ajusteItem.tipoHuevoId, ajusteItem.cantidadAjuste);
            }
            else {
                await this.inventarioStockService.reducirStock(ajusteItem.tipoHuevoId, ajusteItem.cantidadAjuste);
            }
        }
        return await this.ajustesLoteRepository.findOne({
            where: { id: savedLote.id },
            relations: ['usuario', 'ajustes', 'ajustes.tipoHuevo'],
        });
    }
    async findAllLotes() {
        return await this.ajustesLoteRepository.find({
            relations: ['usuario', 'ajustes', 'ajustes.tipoHuevo'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOneLote(id) {
        const lote = await this.ajustesLoteRepository.findOne({
            where: { id },
            relations: ['usuario', 'ajustes', 'ajustes.tipoHuevo'],
        });
        if (!lote) {
            throw new common_1.NotFoundException(`Lote de ajustes con ID ${id} no encontrado`);
        }
        return lote;
    }
    async updateLote(id, updateAjusteLoteDto) {
        const lote = await this.findOneLote(id);
        if (updateAjusteLoteDto.descripcionGeneral) {
            lote.descripcionGeneral = updateAjusteLoteDto.descripcionGeneral;
        }
        await this.ajustesLoteRepository.save(lote);
        return await this.findOneLote(id);
    }
    async removeLote(id) {
        const lote = await this.findOneLote(id);
        if (lote.ajustes && lote.ajustes.length > 0) {
            for (const ajuste of lote.ajustes) {
                if (ajuste.tipoAjuste === 'suma') {
                    await this.inventarioStockService.reducirStock(ajuste.tipoHuevoId, ajuste.cantidadAjuste);
                }
                else {
                    await this.inventarioStockService.aumentarStock(ajuste.tipoHuevoId, ajuste.cantidadAjuste);
                }
            }
            await this.ajustesRepository.remove(lote.ajustes);
        }
        await this.ajustesLoteRepository.remove(lote);
    }
    async update(id, updateAjusteDto) {
        const ajuste = await this.findOne(id);
        if (ajuste.tipoAjuste === 'suma') {
            await this.inventarioStockService.reducirStock(ajuste.tipoHuevoId, ajuste.cantidadAjuste);
        }
        else {
            await this.inventarioStockService.aumentarStock(ajuste.tipoHuevoId, ajuste.cantidadAjuste);
        }
        const inventarioActual = await this.inventarioStockService.findByTipoHuevo(updateAjusteDto.tipoHuevoId);
        const cantidadAnterior = inventarioActual ? inventarioActual.unidades : 0;
        let cantidadNueva;
        if (updateAjusteDto.tipoAjuste === 'suma') {
            cantidadNueva = cantidadAnterior + updateAjusteDto.cantidadAjuste;
        }
        else {
            cantidadNueva = cantidadAnterior - updateAjusteDto.cantidadAjuste;
            if (cantidadNueva < 0) {
                throw new common_1.BadRequestException('No hay suficiente stock para realizar este ajuste');
            }
        }
        Object.assign(ajuste, Object.assign(Object.assign({}, updateAjusteDto), { cantidadAnterior,
            cantidadNueva }));
        const savedAjuste = await this.ajustesRepository.save(ajuste);
        if (updateAjusteDto.tipoAjuste === 'suma') {
            await this.inventarioStockService.aumentarStock(updateAjusteDto.tipoHuevoId, updateAjusteDto.cantidadAjuste);
        }
        else {
            await this.inventarioStockService.reducirStock(updateAjusteDto.tipoHuevoId, updateAjusteDto.cantidadAjuste);
        }
        return await this.findOne(savedAjuste.id);
    }
    async remove(id) {
        const ajuste = await this.findOne(id);
        if (ajuste.tipoAjuste === 'suma') {
            await this.inventarioStockService.reducirStock(ajuste.tipoHuevoId, ajuste.cantidadAjuste);
        }
        else {
            await this.inventarioStockService.aumentarStock(ajuste.tipoHuevoId, ajuste.cantidadAjuste);
        }
        await this.ajustesRepository.remove(ajuste);
    }
};
exports.AjustesInventarioService = AjustesInventarioService;
exports.AjustesInventarioService = AjustesInventarioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ajuste_inventario_entity_1.AjusteInventario)),
    __param(1, (0, typeorm_1.InjectRepository)(ajuste_lote_entity_1.AjusteLote)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        inventario_stock_service_1.InventarioStockService,
        tipos_huevo_service_1.TiposHuevoService,
        users_service_1.UsersService])
], AjustesInventarioService);
//# sourceMappingURL=ajustes-inventario.service.js.map