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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentasTercerosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const venta_entity_1 = require("./entities/venta.entity");
const detalle_venta_entity_1 = require("./entities/detalle-venta.entity");
const ingresos_service_1 = require("../finanzas/ingresos.service");
const inventario_terceros_entity_1 = require("../inventario-terceros/entities/inventario-terceros.entity");
const canasta_entity_1 = require("../canastas/entities/canasta.entity");
const salida_entity_1 = require("../salidas/entities/salida.entity");
const inventario_entity_1 = require("../inventario/entities/inventario.entity");
let VentasTercerosService = class VentasTercerosService {
    constructor(ventasRepository, detallesRepository, invTercerosRepo, canastasRepo, salidasRepo, inventarioRepo, ingresosService) {
        this.ventasRepository = ventasRepository;
        this.detallesRepository = detallesRepository;
        this.invTercerosRepo = invTercerosRepo;
        this.canastasRepo = canastasRepo;
        this.salidasRepo = salidasRepo;
        this.inventarioRepo = inventarioRepo;
        this.ingresosService = ingresosService;
    }
    async create(createVentaDto, idEmpresa, idUsuario) {
        if (!createVentaDto.detalles || createVentaDto.detalles.length === 0) {
            throw new common_1.BadRequestException('Debe incluir al menos un detalle en la venta');
        }
        if (!createVentaDto.idTercero || createVentaDto.idTercero <= 0) {
            throw new common_1.BadRequestException('Debe especificar un cliente (tercero) válido');
        }
        const total = createVentaDto.detalles.reduce((sum, detalle) => sum + (detalle.cantidad * detalle.precioUnitario), 0);
        const _a = createVentaDto, { detalles: detallesDto } = _a, ventaData = __rest(_a, ["detalles"]);
        const detallesValidados = (detallesDto || []).map((detalle) => {
            var _a;
            return (Object.assign(Object.assign({}, detalle), { inventarioOrigen: (_a = detalle.inventarioOrigen) !== null && _a !== void 0 ? _a : 2 }));
        });
        for (const d of detallesValidados) {
            const canastaCodigo = d.canastaId || '';
            if (!canastaCodigo || canastaCodigo.trim() === '') {
                throw new common_1.BadRequestException('Cada detalle debe tener una canasta asignada');
            }
            const canastaExiste = await this.canastasRepo.findOne({ where: { id: canastaCodigo } });
            if (!canastaExiste) {
                throw new common_1.BadRequestException(`La canasta con ID ${canastaCodigo} no existe`);
            }
        }
        const savedVenta = await this.ventasRepository.manager.transaction(async (manager) => {
            var _a, _b, _c;
            const ventasRepo = manager.getRepository(venta_entity_1.Venta);
            const detallesRepo = manager.getRepository(detalle_venta_entity_1.DetalleVenta);
            const invRepo = manager.getRepository(inventario_terceros_entity_1.InventarioTerceros);
            for (const d of detallesValidados) {
                if (((_a = d.inventarioOrigen) !== null && _a !== void 0 ? _a : 2) === 2) {
                    const canastaCodigo = d.canastaId || '';
                    const cantidadCanastas = Number(d.cantidad);
                    if (cantidadCanastas <= 0) {
                        throw new common_1.BadRequestException(`La cantidad debe ser mayor a 0`);
                    }
                    const stockRaw = await invRepo.createQueryBuilder('i')
                        .select("COALESCE(SUM(CASE WHEN i.tipo_movimiento = 'entrada' THEN i.cantidad WHEN i.tipo_movimiento = 'salida' THEN -i.cantidad ELSE 0 END),0)", 'stock')
                        .where('i.id_empresa = :idEmpresa AND i.tipo_huevo_codigo = :tipoHuevoCodigo AND i.activo = true', {
                        idEmpresa,
                        tipoHuevoCodigo: canastaCodigo,
                    })
                        .getRawOne();
                    const stockActual = Number((stockRaw === null || stockRaw === void 0 ? void 0 : stockRaw.stock) || 0);
                    if (stockActual < cantidadCanastas) {
                        const canasta = await this.canastasRepo.findOne({ where: { id: canastaCodigo }, relations: ['tipoHuevo'] });
                        const canastaNombre = (canasta === null || canasta === void 0 ? void 0 : canasta.nombre) || 'Canasta';
                        throw new common_1.BadRequestException(`Stock insuficiente de ${canastaNombre}. Disponible: ${stockActual} canasta(s), solicitado: ${cantidadCanastas} canasta(s)`);
                    }
                }
            }
            const venta = ventasRepo.create(Object.assign(Object.assign({}, ventaData), { total,
                idEmpresa, idUsuarioInserta: idUsuario, tipoMovimiento: 2 }));
            const v = await ventasRepo.save(venta);
            const detalles = detallesValidados.map((d) => {
                var _a;
                return detallesRepo.create(Object.assign(Object.assign({}, d), { idVenta: v.id, inventarioOrigen: (_a = d.inventarioOrigen) !== null && _a !== void 0 ? _a : 2 }));
            });
            await detallesRepo.save(detalles);
            const salidasRepo = manager.getRepository(salida_entity_1.Salida);
            const inventarioRepo = manager.getRepository(inventario_entity_1.Inventario);
            for (const d of detalles) {
                const origen = (_b = d.inventarioOrigen) !== null && _b !== void 0 ? _b : 2;
                const canastaCodigo = d.canastaId || '';
                const cantidadCanastas = Number(d.cantidad);
                const precioCanasta = Number(d.precioUnitario);
                if (origen === 2) {
                    const stockRaw = await invRepo.createQueryBuilder('i')
                        .select("COALESCE(SUM(CASE WHEN i.tipo_movimiento = 'entrada' THEN i.cantidad WHEN i.tipo_movimiento = 'salida' THEN -i.cantidad ELSE 0 END),0)", 'stock')
                        .where('i.id_empresa = :idEmpresa AND i.tipo_huevo_codigo = :tipoHuevoCodigo AND i.activo = true', {
                        idEmpresa,
                        tipoHuevoCodigo: canastaCodigo,
                    })
                        .getRawOne();
                    const stockAnterior = Number((stockRaw === null || stockRaw === void 0 ? void 0 : stockRaw.stock) || 0);
                    const stockNuevo = stockAnterior - cantidadCanastas;
                    const movimiento = invRepo.create({
                        idEmpresa,
                        idTercero: v.idTercero,
                        tipoHuevoCodigo: canastaCodigo,
                        cantidad: cantidadCanastas,
                        tipoMovimiento: 'salida',
                        precioUnitario: precioCanasta,
                        valorTotal: cantidadCanastas * precioCanasta,
                        concepto: 'Venta terceros',
                        descripcion: `Factura ${v.numeroFactura || v.id}`.trim(),
                        stockAnterior,
                        stockActual: stockNuevo,
                        activo: true,
                    });
                    await invRepo.save(movimiento);
                }
                else if (origen === 1) {
                    const canasta = await this.canastasRepo.findOne({ where: { id: canastaCodigo }, relations: ['tipoHuevo'] });
                    if (!canasta) {
                        throw new common_1.BadRequestException(`La canasta con ID ${canastaCodigo} no existe`);
                    }
                    const tipoHuevoId = (_c = canasta.tipoHuevo) === null || _c === void 0 ? void 0 : _c.id;
                    if (!tipoHuevoId) {
                        throw new common_1.BadRequestException(`La canasta ${canasta.nombre} no tiene tipo de huevo asociado`);
                    }
                    const unidadesTotal = cantidadCanastas * canasta.unidadesPorCanasta;
                    const salida = salidasRepo.create({
                        tipoHuevoId,
                        canastaId: canastaCodigo,
                        nombreComprador: `Venta Tercero: ${v.numeroFactura || v.id}`,
                        unidades: unidadesTotal,
                        valor: cantidadCanastas * precioCanasta,
                        fecha: v.fecha,
                        activo: true,
                        id_empresa: idEmpresa,
                        id_usuario_inserta: idUsuario,
                    });
                    await salidasRepo.save(salida);
                    const inv = await inventarioRepo.findOne({
                        where: { tipoHuevoId, id_empresa: idEmpresa }
                    });
                    if (inv) {
                        inv.unidades = Math.max(0, inv.unidades - unidadesTotal);
                        inv.id_usuario_actualiza = idUsuario;
                        await inventarioRepo.save(inv);
                    }
                }
            }
            return v;
        });
        setImmediate(async () => {
            try {
                const ventaCompleta = await this.findOne(savedVenta.id, idEmpresa);
                await this.createIngresoDesdeVenta(ventaCompleta, idEmpresa, idUsuario);
            }
            catch (error) {
                console.error('Error al crear ingreso desde venta:', error);
            }
        });
        return await this.ventasRepository.findOne({
            where: { id: savedVenta.id, idEmpresa },
            relations: ['tercero', 'detalles', 'detalles.canasta']
        });
    }
    async findAll(idEmpresa) {
        return await this.ventasRepository.find({
            where: {
                idEmpresa,
                tipoMovimiento: 2,
                activo: true,
            },
            relations: ['tercero', 'detalles', 'detalles.canasta'],
            order: {
                fecha: 'DESC',
                createdAt: 'DESC'
            },
        });
    }
    async findOne(id, idEmpresa) {
        const venta = await this.ventasRepository.findOne({
            where: { id, idEmpresa, activo: true },
            relations: ['tercero', 'detalles', 'detalles.canasta'],
        });
        if (!venta) {
            throw new common_1.NotFoundException(`Venta con ID ${id} no encontrada`);
        }
        return venta;
    }
    async update(id, updateVentaDto, idEmpresa) {
        const venta = await this.findOne(id, idEmpresa);
        if (updateVentaDto.detalles) {
            const total = updateVentaDto.detalles.reduce((sum, detalle) => sum + (detalle.cantidad * detalle.precioUnitario), 0);
            updateVentaDto['total'] = total;
            const nuevosDetalles = updateVentaDto.detalles.map(detalle => {
                var _a;
                return (Object.assign(Object.assign({}, detalle), { inventarioOrigen: (_a = detalle.inventarioOrigen) !== null && _a !== void 0 ? _a : 2 }));
            });
            for (const d of nuevosDetalles) {
                const canastaCodigo = d.canastaId || '';
                if (!canastaCodigo || canastaCodigo.trim() === '') {
                    throw new common_1.BadRequestException('Cada detalle debe tener una canasta asignada');
                }
                const canastaExiste = await this.canastasRepo.findOne({ where: { id: canastaCodigo } });
                if (!canastaExiste) {
                    throw new common_1.BadRequestException(`La canasta con ID ${canastaCodigo} no existe`);
                }
            }
            await this.ventasRepository.manager.transaction(async (manager) => {
                var _a, _b;
                const detallesRepo = manager.getRepository(detalle_venta_entity_1.DetalleVenta);
                const ventasRepo = manager.getRepository(venta_entity_1.Venta);
                const invRepo = manager.getRepository(inventario_terceros_entity_1.InventarioTerceros);
                await detallesRepo.delete({ idVenta: id });
                await invRepo.createQueryBuilder()
                    .update()
                    .set({ activo: false })
                    .where('id_empresa = :idEmpresa AND concepto = :concepto AND descripcion LIKE :desc', {
                    idEmpresa,
                    concepto: 'Venta terceros',
                    desc: `%${venta.numeroFactura || venta.id}%`
                })
                    .execute();
                for (const d of nuevosDetalles) {
                    if (((_a = d.inventarioOrigen) !== null && _a !== void 0 ? _a : 2) === 2) {
                        const canastaCodigo = d.canastaId || '';
                        const cantidadCanastas = Number(d.cantidad);
                        if (cantidadCanastas <= 0) {
                            throw new common_1.BadRequestException(`La cantidad debe ser mayor a 0`);
                        }
                        const stockActual = await this.getStockActualTercerosWithRepo(invRepo, idEmpresa, venta.idTercero, canastaCodigo);
                        if (stockActual < cantidadCanastas) {
                            const canasta = await this.canastasRepo.findOne({ where: { id: canastaCodigo }, relations: ['tipoHuevo'] });
                            const canastaNombre = (canasta === null || canasta === void 0 ? void 0 : canasta.nombre) || 'Canasta';
                            throw new common_1.BadRequestException(`Stock insuficiente de ${canastaNombre}. Disponible: ${stockActual} canasta(s), solicitado: ${cantidadCanastas} canasta(s)`);
                        }
                    }
                }
                const detalles = nuevosDetalles.map(detalle => {
                    var _a;
                    return detallesRepo.create(Object.assign(Object.assign({}, detalle), { idVenta: id, inventarioOrigen: (_a = detalle.inventarioOrigen) !== null && _a !== void 0 ? _a : 2 }));
                });
                await detallesRepo.save(detalles);
                for (const d of detalles) {
                    if (((_b = d.inventarioOrigen) !== null && _b !== void 0 ? _b : 2) === 2) {
                        const canastaCodigo = d.canastaId || '';
                        const cantidadCanastas = Number(d.cantidad);
                        const precioCanasta = Number(d.precioUnitario);
                        const stockAnterior = await this.getStockActualTercerosWithRepo(invRepo, idEmpresa, venta.idTercero, canastaCodigo);
                        const movimiento = invRepo.create({
                            idEmpresa,
                            idTercero: venta.idTercero,
                            tipoHuevoCodigo: canastaCodigo,
                            cantidad: cantidadCanastas,
                            tipoMovimiento: 'salida',
                            precioUnitario: precioCanasta,
                            valorTotal: cantidadCanastas * precioCanasta,
                            concepto: 'Venta terceros',
                            descripcion: `Factura ${venta.numeroFactura || venta.id}`.trim(),
                            stockAnterior,
                            stockActual: stockAnterior - cantidadCanastas,
                            activo: true,
                        });
                        await invRepo.save(movimiento);
                    }
                }
                const _c = updateVentaDto, { detalles: _omitDetalles } = _c, updateSinDetalles = __rest(_c, ["detalles"]);
                Object.assign(venta, updateSinDetalles);
                await ventasRepo.save(venta);
            });
        }
        else {
            const _a = updateVentaDto, { detalles: _omitDetalles } = _a, updateSinDetalles = __rest(_a, ["detalles"]);
            Object.assign(venta, updateSinDetalles);
            await this.ventasRepository.save(venta);
        }
        const ventaActualizada = await this.findOne(id, idEmpresa);
        try {
            await this.syncIngresoDesdeVenta(ventaActualizada, idEmpresa, ventaActualizada.idUsuarioInserta || '');
        }
        catch (error) {
            console.error('Error al sincronizar ingreso desde venta:', error);
        }
        return ventaActualizada;
    }
    async remove(id, idEmpresa) {
        const venta = await this.findOne(id, idEmpresa);
        venta.activo = false;
        await this.ventasRepository.save(venta);
        try {
            const ingresos = await this.ingresosService.findAllIncludingInactive(idEmpresa);
            const ingresoRelacionado = ingresos.find(i => (i.referencia || '') === venta.id);
            if (ingresoRelacionado) {
                await this.ingresosService.remove(ingresoRelacionado.id);
            }
        }
        catch (_a) { }
        try {
            await this.invTercerosRepo.createQueryBuilder()
                .update()
                .set({ activo: false })
                .where('id_empresa = :idEmpresa AND concepto = :concepto AND descripcion LIKE :desc', {
                idEmpresa,
                concepto: 'Venta terceros',
                desc: `%${venta.numeroFactura || ''}%`
            })
                .execute();
        }
        catch (_b) { }
        return { message: 'Venta eliminada correctamente' };
    }
    async getEstadisticas(idEmpresa) {
        const ventas = await this.findAll(idEmpresa);
        const totalVentas = ventas.length;
        const totalIngresado = ventas.reduce((sum, v) => sum + Number(v.total), 0);
        const ventasPendientes = ventas.filter(v => v.estado === 'PENDIENTE').length;
        const totalPendiente = ventas
            .filter(v => v.estado === 'PENDIENTE')
            .reduce((sum, v) => sum + Number(v.total), 0);
        const ventasPagadas = ventas.filter(v => v.estado === 'PAGADO').length;
        const totalPagado = ventas
            .filter(v => v.estado === 'PAGADO')
            .reduce((sum, v) => sum + Number(v.total), 0);
        return {
            totalVentas,
            totalIngresado,
            ventasPendientes,
            totalPendiente,
            ventasPagadas,
            totalPagado,
            promedioVenta: totalVentas > 0 ? totalIngresado / totalVentas : 0,
        };
    }
    async createIngresoDesdeVenta(venta, idEmpresa, idUsuario) {
        var _a;
        try {
            const ingresoDto = {
                monto: Number(venta.total),
                fecha: venta.fecha,
                descripcion: `Venta terceros ${((_a = venta.tercero) === null || _a === void 0 ? void 0 : _a.nombre) || ''} [origen=terceros]`.trim(),
                observaciones: venta.observaciones || '',
                referencia: venta.id,
                tipo: 'venta',
                id_empresa: idEmpresa,
                id_usuario_inserta: idUsuario,
            };
            const existentes = await this.ingresosService.findAllIncludingInactive(idEmpresa);
            const yaExiste = existentes.some(i => (i.referencia || '') === venta.id);
            if (!yaExiste) {
                await this.ingresosService.create(ingresoDto);
            }
        }
        catch (e) {
        }
    }
    async syncIngresoDesdeVenta(venta, idEmpresa, idUsuario) {
        var _a;
        try {
            const ingresos = await this.ingresosService.findAllIncludingInactive(idEmpresa);
            const ingresoRelacionado = ingresos.find(i => (i.referencia || '') === venta.id);
            if (ingresoRelacionado) {
                await this.ingresosService.update(ingresoRelacionado.id, {
                    descripcion: `Venta terceros ${((_a = venta.tercero) === null || _a === void 0 ? void 0 : _a.nombre) || ''} [origen=terceros]`.trim(),
                    monto: Number(venta.total),
                    fecha: venta.fecha,
                    observaciones: ingresoRelacionado.observaciones || '',
                    tipo: ingresoRelacionado.tipo || 'venta',
                });
            }
            else {
                await this.createIngresoDesdeVenta(venta, idEmpresa, idUsuario);
            }
        }
        catch (_b) { }
    }
    async getStockActualTerceros(idEmpresa, idTercero, tipoHuevoCodigo) {
        if (!tipoHuevoCodigo)
            return 0;
        const raw = await this.invTercerosRepo.createQueryBuilder('i')
            .select("COALESCE(SUM(CASE WHEN i.tipo_movimiento = 'entrada' THEN i.cantidad WHEN i.tipo_movimiento = 'salida' THEN -i.cantidad ELSE 0 END),0)", 'stock')
            .where('i.id_empresa = :idEmpresa AND i.tipo_huevo_codigo = :tipoHuevoCodigo AND i.activo = true', {
            idEmpresa,
            tipoHuevoCodigo,
        })
            .andWhere("EXISTS (SELECT 1 FROM canastas c WHERE c.id::text = i.tipo_huevo_codigo)")
            .getRawOne();
        return Number((raw === null || raw === void 0 ? void 0 : raw.stock) || 0);
    }
    async getStockActualTercerosWithRepo(repo, idEmpresa, idTercero, tipoHuevoCodigo) {
        if (!tipoHuevoCodigo)
            return 0;
        const raw = await repo.createQueryBuilder('i')
            .select("COALESCE(SUM(CASE WHEN i.tipo_movimiento = 'entrada' THEN i.cantidad WHEN i.tipo_movimiento = 'salida' THEN -i.cantidad ELSE 0 END),0)", 'stock')
            .where('i.id_empresa = :idEmpresa AND i.tipo_huevo_codigo = :tipoHuevoCodigo AND i.activo = true', {
            idEmpresa,
            tipoHuevoCodigo,
        })
            .andWhere("EXISTS (SELECT 1 FROM canastas c WHERE c.id::text = i.tipo_huevo_codigo)")
            .getRawOne();
        return Number((raw === null || raw === void 0 ? void 0 : raw.stock) || 0);
    }
};
exports.VentasTercerosService = VentasTercerosService;
exports.VentasTercerosService = VentasTercerosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(venta_entity_1.Venta)),
    __param(1, (0, typeorm_1.InjectRepository)(detalle_venta_entity_1.DetalleVenta)),
    __param(2, (0, typeorm_1.InjectRepository)(inventario_terceros_entity_1.InventarioTerceros)),
    __param(3, (0, typeorm_1.InjectRepository)(canasta_entity_1.Canasta)),
    __param(4, (0, typeorm_1.InjectRepository)(salida_entity_1.Salida)),
    __param(5, (0, typeorm_1.InjectRepository)(inventario_entity_1.Inventario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        ingresos_service_1.IngresosService])
], VentasTercerosService);
//# sourceMappingURL=ventas-terceros.service.js.map