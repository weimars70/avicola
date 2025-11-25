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
exports.FinanzasController = void 0;
const common_1 = require("@nestjs/common");
const gastos_service_1 = require("./gastos.service");
const ingresos_service_1 = require("./ingresos.service");
const resumen_service_1 = require("./resumen.service");
const galpones_service_1 = require("../galpones/galpones.service");
const entradas_produccion_service_1 = require("../entradas-produccion/entradas-produccion.service");
const salidas_service_1 = require("../salidas/salidas.service");
const resumen_service_2 = require("../inventario/resumen.service");
const empresa_decorator_1 = require("../terceros/decorators/empresa.decorator");
let FinanzasController = class FinanzasController {
    constructor(gastosService, ingresosService, resumenService, galponesService, entradasProduccionService, salidasService, inventarioResumenService) {
        this.gastosService = gastosService;
        this.ingresosService = ingresosService;
        this.resumenService = resumenService;
        this.galponesService = galponesService;
        this.entradasProduccionService = entradasProduccionService;
        this.salidasService = salidasService;
        this.inventarioResumenService = inventarioResumenService;
    }
    async getResumenFinanciero(id_empresa_num, fechaInicio, fechaFin, origen) {
        let totalIngresos;
        let totalGastos;
        let totalGastosOperativos;
        let totalInversionInicial;
        let gastosPorCategoria;
        let ingresosPorTipo;
        const esTerceros = origen && origen.toLowerCase() === 'terceros';
        if (esTerceros) {
            const ingresosTerceros = await this.getTotalIngresosTerceros(fechaInicio, fechaFin, id_empresa_num);
            const gastosTerceros = await this.getTotalGastosTerceros(fechaInicio, fechaFin, id_empresa_num);
            totalIngresos = ingresosTerceros;
            totalGastos = gastosTerceros;
            totalGastosOperativos = gastosTerceros;
        }
        else {
            if (fechaInicio && fechaFin) {
                totalIngresos = await this.ingresosService.getTotalIngresosByDateRange(fechaInicio, fechaFin, id_empresa_num);
                totalGastos = await this.gastosService.getTotalGastosByDateRange(fechaInicio, fechaFin, id_empresa_num);
                totalGastosOperativos = await this.gastosService.getTotalGastosByDateRangeExcluyendoInversion(fechaInicio, fechaFin, id_empresa_num);
            }
            else {
                totalIngresos = await this.ingresosService.getTotalIngresos(id_empresa_num);
                totalGastos = await this.gastosService.getTotalGastos(id_empresa_num);
                totalGastosOperativos = await this.gastosService.getTotalGastosExcluyendoInversion(id_empresa_num);
            }
        }
        totalInversionInicial = await this.gastosService.getTotalInversionInicial(id_empresa_num);
        gastosPorCategoria = esTerceros ? [] : await this.gastosService.getTotalGastosByCategoria(id_empresa_num);
        ingresosPorTipo = esTerceros ? [] : await this.ingresosService.getTotalIngresosByTipo(id_empresa_num);
        const utilidadOperativa = totalIngresos - totalGastosOperativos;
        const utilidadNeta = totalIngresos - totalGastos;
        const margenUtilidad = totalIngresos > 0 ? (utilidadOperativa / totalIngresos) * 100 : 0;
        const recuperacionInversion = totalInversionInicial > 0 ? (utilidadOperativa / totalInversionInicial) * 100 : 0;
        return {
            totalIngresos,
            totalGastos,
            totalGastosOperativos,
            totalInversionInicial,
            utilidadOperativa,
            utilidadNeta,
            margenUtilidad: parseFloat(margenUtilidad.toFixed(2)),
            recuperacionInversion: parseFloat(recuperacionInversion.toFixed(2)),
            gastosPorCategoria,
            ingresosPorTipo,
            periodo: fechaInicio && fechaFin ? {
                fechaInicio,
                fechaFin
            } : null,
            origen: esTerceros ? 'terceros' : 'general'
        };
    }
    async getComparativoMensual(id_empresa_num, anio) {
        try {
            const anioActual = anio ? parseInt(anio) : new Date().getFullYear();
            const totalInversionInicial = await this.gastosService.getTotalInversionInicial(id_empresa_num);
            const meses = [];
            const ingresosMensuales = [];
            const gastosMensuales = [];
            const utilidadesMensuales = [];
            for (let mes = 0; mes < 12; mes++) {
                const fechaInicio = new Date(anioActual, mes, 1).toISOString().split('T')[0];
                const fechaFin = new Date(anioActual, mes + 1, 0).toISOString().split('T')[0];
                const ingresos = await this.ingresosService.getTotalIngresosByDateRange(fechaInicio, fechaFin, id_empresa_num);
                const gastosTotal = await this.gastosService.getTotalGastosByDateRange(fechaInicio, fechaFin, id_empresa_num);
                const gastosOperativos = await this.gastosService.getTotalGastosByDateRangeExcluyendoInversion(fechaInicio, fechaFin, id_empresa_num);
                const utilidadOperativa = ingresos - gastosOperativos;
                const utilidadNeta = ingresos - gastosTotal;
                const margenUtilidad = ingresos > 0 ? (utilidadOperativa / ingresos) * 100 : 0;
                meses.push({
                    mes,
                    nombreMes: new Date(anioActual, mes).toLocaleString('es', { month: 'long' }),
                    ingresos,
                    gastosTotal,
                    gastosOperativos,
                    utilidadOperativa,
                    utilidadNeta,
                    margenUtilidad: parseFloat(margenUtilidad.toFixed(2))
                });
            }
            return {
                anio: anioActual,
                totalInversionInicial,
                meses
            };
        }
        catch (error) {
            console.error('Error en comparativo mensual:', error);
            throw error;
        }
    }
    async getKPIsFinancieros(id_empresa_num, fechaInicio, fechaFin) {
        const resumen = await this.getResumenFinanciero(id_empresa_num, fechaInicio, fechaFin);
        const promedioGastoDiario = fechaInicio && fechaFin ?
            this.calcularPromedioGastoDiario(resumen.totalGastos, fechaInicio, fechaFin) : 0;
        const promedioIngresoDiario = fechaInicio && fechaFin ?
            this.calcularPromedioIngresoDiario(resumen.totalIngresos, fechaInicio, fechaFin) : 0;
        return Object.assign(Object.assign({}, resumen), { promedioGastoDiario: parseFloat(promedioGastoDiario.toFixed(2)), promedioIngresoDiario: parseFloat(promedioIngresoDiario.toFixed(2)), ratioIngresoGasto: resumen.totalGastos > 0 ?
                parseFloat((resumen.totalIngresos / resumen.totalGastos).toFixed(2)) : 0 });
    }
    async getDashboardKpis(id_empresa_num) {
        try {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            const fechaInicio = startOfMonth.toISOString().split('T')[0];
            const fechaFin = endOfMonth.toISOString().split('T')[0];
            const entradasDelMes = await this.entradasProduccionService.findByDateRange(fechaInicio, fechaFin, id_empresa_num);
            const produccionTotal = entradasDelMes.reduce((total, entrada) => total + entrada.unidades, 0);
            const ingresosDelMes = await this.ingresosService.getTotalIngresosByDateRange(fechaInicio, fechaFin, id_empresa_num);
            const resumenInventario = await this.inventarioResumenService.getInventarioResumen(null, null, id_empresa_num);
            const inventarioActual = Object.values(resumenInventario)
                .filter((item) => item.tipoHuevo && item.tipoHuevo.id_empresa === id_empresa_num)
                .reduce((total, item) => {
                return total + (item.stockActual || 0);
            }, 0);
            const galpones = await this.galponesService.findAll(id_empresa_num);
            const galponesActivos = galpones.filter(g => g.activo).length;
            const totalGalpones = galpones.length;
            const gallinasTotal = galpones
                .reduce((total, galpon) => total + (galpon.capacidad || 0), 0);
            const gallinasActivas = galpones
                .filter(g => g.activo)
                .reduce((total, galpon) => total + (galpon.capacidad || 0), 0);
            return {
                produccionTotal,
                ingresosDelMes: Math.round(ingresosDelMes / 1000),
                inventarioActual,
                galponesActivos,
                totalGalpones,
                gallinasTotal,
                gallinasActivas
            };
        }
        catch (error) {
            console.error('Error getting dashboard KPIs:', error);
            throw error;
        }
    }
    calcularPromedioGastoDiario(totalGastos, fechaInicio, fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        const diasDiferencia = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return diasDiferencia > 0 ? totalGastos / diasDiferencia : 0;
    }
    calcularPromedioIngresoDiario(totalIngresos, fechaInicio, fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        const diasDiferencia = Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return diasDiferencia > 0 ? totalIngresos / diasDiferencia : 0;
    }
    async getTotalIngresosTerceros(fechaInicio, fechaFin, id_empresa) {
        try {
            const ingresos = await this.ingresosService.findAllIncludingInactive(id_empresa);
            const terceros = ingresos.filter(i => (i.tipo === 'venta') && !i.salidaId && (i.referencia || '').length > 0 && (i.descripcion || '').toLowerCase().startsWith('venta terceros'));
            if (fechaInicio && fechaFin) {
                const fi = new Date(fechaInicio);
                const ff = new Date(fechaFin);
                return terceros.filter(i => {
                    const d = new Date(i.fecha);
                    return d >= fi && d <= ff;
                }).reduce((s, i) => s + Number(i.monto), 0);
            }
            return terceros.reduce((s, i) => s + Number(i.monto), 0);
        }
        catch (_a) {
            return 0;
        }
    }
    async getTotalGastosTerceros(fechaInicio, fechaFin, id_empresa) {
        const gastos = await this.gastosService.findAll(id_empresa);
        const terceros = gastos.filter(g => { var _a; return ((_a = g.categoria) === null || _a === void 0 ? void 0 : _a.nombre) === 'Compras de Terceros'; });
        if (fechaInicio && fechaFin) {
            const fi = new Date(fechaInicio);
            const ff = new Date(fechaFin);
            return terceros.filter(g => {
                const d = new Date(g.fecha);
                return d >= fi && d <= ff;
            }).reduce((s, g) => s + Number(g.monto), 0);
        }
        return terceros.reduce((s, g) => s + Number(g.monto), 0);
    }
    async setInversionInicial(inversionData, id_empresa, id_usuario_inserta) {
        try {
            if (!id_empresa || !id_usuario_inserta) {
                throw new common_1.BadRequestException('id_empresa e id_usuario_inserta son obligatorios');
            }
            const resultado = await this.gastosService.createOrUpdateInversionInicial(inversionData.montoTotal, inversionData.fechaInicio, inversionData.metaRecuperacion, id_empresa, id_usuario_inserta);
            return {
                success: true,
                message: 'Inversión inicial registrada exitosamente',
                data: resultado
            };
        }
        catch (error) {
            console.error('Error setting inversion inicial:', error);
            throw error;
        }
    }
    async getDatosDiarios(id_empresa_num, fechaInicio, fechaFin) {
        try {
            let inicio = fechaInicio;
            let fin = fechaFin;
            if (!inicio || !fin) {
                const ahora = new Date();
                const hace7Dias = new Date(ahora);
                hace7Dias.setDate(ahora.getDate() - 7);
                inicio = hace7Dias.toISOString().split('T')[0];
                fin = ahora.toISOString().split('T')[0];
            }
            const ingresosDiarios = await this.ingresosService.getIngresosDiarios(inicio, fin, id_empresa_num);
            const produccionDiaria = await this.entradasProduccionService.getProduccionDiaria(inicio, fin, id_empresa_num);
            const salidasDiarias = await this.salidasService.getSalidasDiarias(inicio, fin, id_empresa_num);
            const canastasDiarias = await this.salidasService.getCanastasDiarias(inicio, fin, id_empresa_num);
            const gastosDiarios = await this.gastosService.getGastosDiarios(inicio, fin, id_empresa_num);
            const datosCombinados = {};
            ingresosDiarios.forEach((ingreso) => {
                const fecha = new Date(ingreso.fecha).toISOString().split('T')[0];
                if (!datosCombinados[fecha]) {
                    datosCombinados[fecha] = { ingresos: 0, produccion: 0, salidas: 0, canastas: 0, gastos: 0 };
                }
                datosCombinados[fecha].ingresos = parseFloat(ingreso.total) || 0;
            });
            produccionDiaria.forEach((produccion) => {
                const fecha = new Date(produccion.fecha).toISOString().split('T')[0];
                if (!datosCombinados[fecha]) {
                    datosCombinados[fecha] = { ingresos: 0, produccion: 0, salidas: 0, canastas: 0, gastos: 0 };
                }
                datosCombinados[fecha].produccion = parseInt(produccion.total) || 0;
            });
            salidasDiarias.forEach((salida) => {
                const fecha = new Date(salida.fecha).toISOString().split('T')[0];
                if (!datosCombinados[fecha]) {
                    datosCombinados[fecha] = { ingresos: 0, produccion: 0, salidas: 0, canastas: 0, gastos: 0 };
                }
                datosCombinados[fecha].salidas = parseInt(salida.salidas) || 0;
            });
            canastasDiarias.forEach((canasta) => {
                const fecha = new Date(canasta.fecha).toISOString().split('T')[0];
                if (!datosCombinados[fecha]) {
                    datosCombinados[fecha] = { ingresos: 0, produccion: 0, salidas: 0, canastas: 0, gastos: 0 };
                }
                datosCombinados[fecha].canastas = parseInt(canasta.canastas) || 0;
            });
            gastosDiarios.forEach((gasto) => {
                const fecha = new Date(gasto.fecha).toISOString().split('T')[0];
                if (!datosCombinados[fecha]) {
                    datosCombinados[fecha] = { ingresos: 0, produccion: 0, salidas: 0, canastas: 0, gastos: 0 };
                }
                datosCombinados[fecha].gastos = parseFloat(gasto.total) || 0;
            });
            return datosCombinados;
        }
        catch (error) {
            console.error('Error getting datos diarios:', error);
            throw error;
        }
    }
};
exports.FinanzasController = FinanzasController;
__decorate([
    (0, common_1.Get)('resumen'),
    __param(0, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __param(1, (0, common_1.Query)('fechaInicio')),
    __param(2, (0, common_1.Query)('fechaFin')),
    __param(3, (0, common_1.Query)('origen')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String, String]),
    __metadata("design:returntype", Promise)
], FinanzasController.prototype, "getResumenFinanciero", null);
__decorate([
    (0, common_1.Get)('comparativo-mensual'),
    __param(0, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __param(1, (0, common_1.Query)('anio')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], FinanzasController.prototype, "getComparativoMensual", null);
__decorate([
    (0, common_1.Get)('kpis'),
    __param(0, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __param(1, (0, common_1.Query)('fechaInicio')),
    __param(2, (0, common_1.Query)('fechaFin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], FinanzasController.prototype, "getKPIsFinancieros", null);
__decorate([
    (0, common_1.Get)('dashboard-kpis'),
    __param(0, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FinanzasController.prototype, "getDashboardKpis", null);
__decorate([
    (0, common_1.Post)('inversion-inicial'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)('id_empresa', new common_1.ParseIntPipe())),
    __param(2, (0, common_1.Query)('id_usuario_inserta')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String]),
    __metadata("design:returntype", Promise)
], FinanzasController.prototype, "setInversionInicial", null);
__decorate([
    (0, common_1.Get)('datos-diarios'),
    __param(0, (0, empresa_decorator_1.IdEmpresaHeader)()),
    __param(1, (0, common_1.Query)('fechaInicio')),
    __param(2, (0, common_1.Query)('fechaFin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], FinanzasController.prototype, "getDatosDiarios", null);
exports.FinanzasController = FinanzasController = __decorate([
    (0, common_1.Controller)('finanzas'),
    __metadata("design:paramtypes", [gastos_service_1.GastosService,
        ingresos_service_1.IngresosService,
        resumen_service_1.ResumenService,
        galpones_service_1.GalponesService,
        entradas_produccion_service_1.EntradasProduccionService,
        salidas_service_1.SalidasService,
        resumen_service_2.ResumenService])
], FinanzasController);
//# sourceMappingURL=finanzas.controller.js.map