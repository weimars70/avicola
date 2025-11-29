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
exports.ResumenService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entrada_produccion_entity_1 = require("../entradas-produccion/entities/entrada-produccion.entity");
const salida_entity_1 = require("../salidas/entities/salida.entity");
const inventario_entity_1 = require("./entities/inventario.entity");
const inventario_terceros_entity_1 = require("../inventario-terceros/entities/inventario-terceros.entity");
const canasta_entity_1 = require("../canastas/entities/canasta.entity");
let ResumenService = class ResumenService {
    constructor(entradasRepository, salidasRepository, inventarioRepository, invTercerosRepository, canastasRepository) {
        this.entradasRepository = entradasRepository;
        this.salidasRepository = salidasRepository;
        this.inventarioRepository = inventarioRepository;
        this.invTercerosRepository = invTercerosRepository;
        this.canastasRepository = canastasRepository;
    }
    async getInventarioResumen(galponId, tipoHuevoId, id_empresa) {
        if (!id_empresa) {
            throw new Error('No hay empresa asociada al usuario logueado');
        }
        const entradasQuery = this.entradasRepository
            .createQueryBuilder('entrada')
            .leftJoinAndSelect('entrada.galpon', 'galpon')
            .leftJoinAndSelect('entrada.tipoHuevo', 'tipoHuevo')
            .where('entrada.id_empresa = :id_empresa', { id_empresa });
        if (galponId) {
            entradasQuery.andWhere('entrada.galponId = :galponId', { galponId });
        }
        if (tipoHuevoId) {
            entradasQuery.andWhere('entrada.tipoHuevoId = :tipoHuevoId', { tipoHuevoId });
        }
        const salidasQuery = this.salidasRepository
            .createQueryBuilder('salida')
            .leftJoinAndSelect('salida.tipoHuevo', 'tipoHuevo')
            .where('salida.id_empresa = :id_empresa', { id_empresa });
        if (tipoHuevoId) {
            salidasQuery.andWhere('salida.tipoHuevoId = :tipoHuevoId', { tipoHuevoId });
        }
        const inventarioQuery = this.inventarioRepository
            .createQueryBuilder('inventario')
            .leftJoinAndSelect('inventario.tipoHuevo', 'tipoHuevo')
            .where('inventario.id_empresa = :id_empresa', { id_empresa });
        if (tipoHuevoId) {
            inventarioQuery.andWhere('inventario.tipoHuevoId = :tipoHuevoId', { tipoHuevoId });
        }
        const [entradas, salidas, inventarioActual] = await Promise.all([
            entradasQuery.getMany(),
            salidasQuery.getMany(),
            inventarioQuery.getMany(),
        ]);
        const resumen = {};
        entradas.forEach(entrada => {
            const key = galponId ? `${entrada.galponId}-${entrada.tipoHuevoId}` : entrada.tipoHuevoId;
            if (!resumen[key]) {
                resumen[key] = {
                    galponId: entrada.galponId,
                    galpon: entrada.galpon,
                    tipoHuevoId: entrada.tipoHuevoId,
                    tipoHuevo: entrada.tipoHuevo,
                    totalEntradas: 0,
                    totalSalidas: 0,
                    stockActual: 0,
                    valorTotal: 0,
                };
            }
            resumen[key].totalEntradas += entrada.unidades;
        });
        salidas.forEach(salida => {
            const key = galponId ? `${galponId}-${salida.tipoHuevoId}` : salida.tipoHuevoId;
            if (!resumen[key]) {
                resumen[key] = {
                    galponId: galponId || null,
                    galpon: null,
                    tipoHuevoId: salida.tipoHuevoId,
                    tipoHuevo: salida.tipoHuevo,
                    totalEntradas: 0,
                    totalSalidas: 0,
                    stockActual: 0,
                    valorTotal: 0,
                };
            }
            resumen[key].totalSalidas += salida.unidades;
        });
        inventarioActual.forEach(inv => {
            const key = galponId ? `${galponId}-${inv.tipoHuevoId}` : inv.tipoHuevoId;
            if (!resumen[key]) {
                resumen[key] = {
                    galponId: galponId || null,
                    galpon: null,
                    tipoHuevoId: inv.tipoHuevoId,
                    tipoHuevo: inv.tipoHuevo,
                    totalEntradas: 0,
                    totalSalidas: 0,
                    stockActual: 0,
                    valorTotal: 0,
                };
            }
            resumen[key].stockActual = inv.unidades;
        });
        const resultado = Object.values(resumen).map((item) => {
            var _a;
            if (item.stockActual === 0) {
                item.stockActual = item.totalEntradas - item.totalSalidas;
            }
            item.valorTotal = item.stockActual * (((_a = item.tipoHuevo) === null || _a === void 0 ? void 0 : _a.valorUnidad) || 0);
            return item;
        });
        return resultado;
    }
    async getInventarioTercerosResumen(id_empresa, id_tercero) {
        if (!id_empresa) {
            throw new Error('No hay empresa asociada al usuario logueado');
        }
        const query = this.invTercerosRepository
            .createQueryBuilder('i')
            .leftJoin(canasta_entity_1.Canasta, 'c', 'c.id::text = i.tipo_huevo_codigo')
            .select(['i.tipo_huevo_codigo AS "canastaId"'])
            .addSelect("COALESCE(SUM(CASE WHEN i.tipo_movimiento = 'entrada' THEN i.cantidad WHEN i.tipo_movimiento = 'salida' THEN -i.cantidad ELSE 0 END),0)", 'stockCanastas')
            .where('i.id_empresa = :id_empresa AND i.activo = true', { id_empresa })
            .andWhere('c.id IS NOT NULL');
        if (id_tercero) {
            query.andWhere('i.id_tercero = :id_tercero', { id_tercero });
        }
        query.groupBy('i.tipo_huevo_codigo');
        const rows = await query.getRawMany();
        const ids = rows.map(r => r.canastaId).filter(Boolean);
        const canastas = ids.length > 0 ? await this.canastasRepository.findBy({ id: ids }) : [];
        const canastaMap = new Map(canastas.map(c => [c.id, c]));
        return rows.map(r => ({
            canasta: canastaMap.get(r.canastaId) || { id: r.canastaId, nombre: 'Canasta', unidadesPorCanasta: 0 },
            stockActual: Number(r.stockCanastas || 0),
        }));
    }
};
exports.ResumenService = ResumenService;
exports.ResumenService = ResumenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entrada_produccion_entity_1.EntradaProduccion)),
    __param(1, (0, typeorm_1.InjectRepository)(salida_entity_1.Salida)),
    __param(2, (0, typeorm_1.InjectRepository)(inventario_entity_1.Inventario)),
    __param(3, (0, typeorm_1.InjectRepository)(inventario_terceros_entity_1.InventarioTerceros)),
    __param(4, (0, typeorm_1.InjectRepository)(canasta_entity_1.Canasta)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ResumenService);
//# sourceMappingURL=resumen.service.js.map