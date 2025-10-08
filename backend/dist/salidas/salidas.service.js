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
exports.SalidasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const salida_entity_1 = require("./entities/salida.entity");
const tipos_huevo_service_1 = require("../tipos-huevo/tipos-huevo.service");
const canastas_service_1 = require("../canastas/canastas.service");
const inventario_stock_service_1 = require("../inventario/inventario-stock.service");
const ingresos_service_1 = require("../finanzas/ingresos.service");
let SalidasService = class SalidasService {
    constructor(salidasRepository, tiposHuevoService, canastasService, inventarioStockService, ingresosService, dataSource) {
        this.salidasRepository = salidasRepository;
        this.tiposHuevoService = tiposHuevoService;
        this.canastasService = canastasService;
        this.inventarioStockService = inventarioStockService;
        this.ingresosService = ingresosService;
        this.dataSource = dataSource;
    }
    async create(createSalidaDto, id_empresa) {
        const tipoHuevo = await this.tiposHuevoService.findOne(createSalidaDto.tipoHuevoId);
        let canasta = null;
        let unidadesTotales = createSalidaDto.unidades;
        if (createSalidaDto.canastaId) {
            canasta = await this.canastasService.findOne(createSalidaDto.canastaId, id_empresa);
            unidadesTotales = createSalidaDto.unidades * canasta.unidadesPorCanasta;
        }
        await this.inventarioStockService.reducirInventario(createSalidaDto.tipoHuevoId, unidadesTotales);
        const fechaFinal = createSalidaDto.fecha || new Date().toISOString().split('T')[0];
        const salida = this.salidasRepository.create(Object.assign(Object.assign({}, createSalidaDto), { fecha: fechaFinal }));
        const savedSalida = await this.salidasRepository.save(salida);
        try {
            let monto = 0;
            let descripcion = '';
            if (canasta) {
                monto = createSalidaDto.unidades * canasta.valorCanasta;
                descripcion = `Venta de ${createSalidaDto.unidades} ${canasta.nombre} de ${tipoHuevo.nombre}`;
            }
            else {
                monto = createSalidaDto.valor || (createSalidaDto.unidades * tipoHuevo.valorUnidad);
            }
            await this.ingresosService.create({
                monto,
                fecha: fechaFinal,
                descripcion,
                observaciones: `Generado automáticamente desde salida ${savedSalida.id}`,
                tipo: 'venta',
                salidaId: savedSalida.id,
            });
        }
        catch (error) {
            console.error('Error al crear ingreso automático:', error);
        }
        return savedSalida;
    }
    async findAll(id_empresa) {
        return this.salidasRepository.find({
            where: { id_empresa },
            relations: ['tipoHuevo', 'canasta'],
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id, id_empresa) {
        const salida = await this.salidasRepository.findOne({
            where: { id, id_empresa },
            relations: ['tipoHuevo', 'canasta']
        });
        if (!salida) {
            throw new common_1.NotFoundException(`Salida con ID ${id} no encontrada`);
        }
        return salida;
    }
    async update(id, updateSalidaDto, id_empresa) {
        var _a;
        const salida = await this.findOne(id, id_empresa);
        const unidadesOriginales = salida.unidades;
        const tipoHuevoOriginal = salida.tipoHuevoId;
        if (updateSalidaDto.tipoHuevoId) {
            await this.tiposHuevoService.findOne(updateSalidaDto.tipoHuevoId);
        }
        if (updateSalidaDto.canastaId && updateSalidaDto.id_empresa) {
            await this.canastasService.findOne(updateSalidaDto.canastaId, updateSalidaDto.id_empresa);
        }
        if (updateSalidaDto.unidades !== undefined || updateSalidaDto.tipoHuevoId) {
            const nuevoTipoHuevo = updateSalidaDto.tipoHuevoId || tipoHuevoOriginal;
            const nuevasUnidades = updateSalidaDto.unidades !== undefined ? updateSalidaDto.unidades : unidadesOriginales;
            await this.inventarioStockService.aumentarStock(tipoHuevoOriginal, unidadesOriginales);
            await this.inventarioStockService.reducirStock(nuevoTipoHuevo, nuevasUnidades);
        }
        if (updateSalidaDto.unidades !== undefined && !updateSalidaDto.valor) {
            let valorCanasta = 0;
            if (updateSalidaDto.canastaId) {
                const canasta = await this.canastasService.findOne(updateSalidaDto.canastaId, id_empresa);
                valorCanasta = canasta.valorCanasta;
            }
            else if (salida.canastaId) {
                const canasta = await this.canastasService.findOne(salida.canastaId, id_empresa);
                valorCanasta = canasta.valorCanasta;
            }
            if (valorCanasta > 0) {
                updateSalidaDto.valor = updateSalidaDto.unidades * valorCanasta;
            }
        }
        Object.assign(salida, updateSalidaDto);
        const salidaActualizada = await this.salidasRepository.save(salida);
        try {
            const ingresos = await this.dataSource.getRepository('ingresos').find({
                where: { salidaId: id }
            });
            if (ingresos && ingresos.length > 0) {
                const ingreso = ingresos[0];
                await this.dataSource.getRepository('ingresos').update({ id: ingreso.id }, {
                    monto: salidaActualizada.valor,
                    descripcion: `Venta de ${salidaActualizada.unidades} unidades de ${((_a = salidaActualizada.tipoHuevo) === null || _a === void 0 ? void 0 : _a.nombre) || 'huevos'}`
                });
            }
        }
        catch (error) {
            console.error('Error al actualizar el ingreso relacionado:', error);
        }
        return salidaActualizada;
    }
    async remove(id, id_empresa) {
        const salida = await this.findOne(id, id_empresa);
        await this.salidasRepository.remove(salida);
    }
    async getSalidasDiarias(fechaInicio, fechaFin, id_empresa) {
        const query = `
      SELECT 
        salida.fecha as fecha,
        SUM(
          CASE 
            WHEN salida."canastaId" IS NOT NULL THEN salida.unidades * canasta."unidadesPorCanasta"
            ELSE salida.unidades
          END
        ) as salidas
      FROM salidas salida
      LEFT JOIN canastas canasta ON salida."canastaId" = canasta.id
      WHERE salida.fecha BETWEEN $1 AND $2
      ${id_empresa ? 'AND salida.id_empresa = $3' : ''}
      GROUP BY salida.fecha
      ORDER BY fecha ASC
    `;
        return this.salidasRepository.query(query, id_empresa ? [fechaInicio, fechaFin, id_empresa] : [fechaInicio, fechaFin]);
    }
    async getCanastasDiarias(fechaInicio, fechaFin, id_empresa) {
        const query = `
      SELECT 
        salida.fecha as fecha,
        SUM(salida.unidades) as canastas
      FROM salidas salida
      WHERE salida.fecha BETWEEN $1 AND $2
      ${id_empresa ? 'AND salida.id_empresa = $3' : ''}
      GROUP BY salida.fecha
      ORDER BY fecha ASC
    `;
        return this.salidasRepository.query(query, id_empresa ? [fechaInicio, fechaFin, id_empresa] : [fechaInicio, fechaFin]);
    }
};
exports.SalidasService = SalidasService;
exports.SalidasService = SalidasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(salida_entity_1.Salida)),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => ingresos_service_1.IngresosService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        tipos_huevo_service_1.TiposHuevoService,
        canastas_service_1.CanastasService,
        inventario_stock_service_1.InventarioStockService,
        ingresos_service_1.IngresosService,
        typeorm_2.DataSource])
], SalidasService);
//# sourceMappingURL=salidas.service.js.map