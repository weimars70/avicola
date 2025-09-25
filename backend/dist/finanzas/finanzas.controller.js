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
    async getResumenFinanciero(fechaInicio, fechaFin) {
        let totalIngresos;
        let totalGastos;
        let totalGastosOperativos;
        let totalInversionInicial;
        let gastosPorCategoria;
        let ingresosPorTipo;
        if (fechaInicio && fechaFin) {
            totalIngresos = await this.ingresosService.getTotalIngresosByDateRange(fechaInicio, fechaFin);
            totalGastos = await this.gastosService.getTotalGastosByDateRange(fechaInicio, fechaFin);
            totalGastosOperativos = await this.gastosService.getTotalGastosByDateRangeExcluyendoInversion(fechaInicio, fechaFin);
        }
        else {
            totalIngresos = await this.ingresosService.getTotalIngresos();
            totalGastos = await this.gastosService.getTotalGastos();
            totalGastosOperativos = await this.gastosService.getTotalGastosExcluyendoInversion();
        }
        totalInversionInicial = await this.gastosService.getTotalInversionInicial();
        gastosPorCategoria = await this.gastosService.getTotalGastosByCategoria();
        ingresosPorTipo = await this.ingresosService.getTotalIngresosByTipo();
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
            } : null
        };
    }
    async getComparativoMensual(año) {
        const añoActual = año ? parseInt(año) : new Date().getFullYear();
        const meses = [];
        const totalInversionInicial = await this.gastosService.getTotalInversionInicial();
        for (let mes = 1; mes <= 12; mes++) {
            const fechaInicio = `${añoActual}-${mes.toString().padStart(2, '0')}-01`;
            const ultimoDia = new Date(añoActual, mes, 0).getDate();
            const fechaFin = `${añoActual}-${mes.toString().padStart(2, '0')}-${ultimoDia}`;
            const ingresos = await this.ingresosService.getTotalIngresosByDateRange(fechaInicio, fechaFin);
            const gastosTotal = await this.gastosService.getTotalGastosByDateRange(fechaInicio, fechaFin);
            const gastosOperativos = await this.gastosService.getTotalGastosByDateRangeExcluyendoInversion(fechaInicio, fechaFin);
            const utilidadOperativa = ingresos - gastosOperativos;
            const utilidadNeta = ingresos - gastosTotal;
            const margenUtilidad = ingresos > 0 ? (utilidadOperativa / ingresos) * 100 : 0;
            meses.push({
                mes,
                nombreMes: new Date(añoActual, mes - 1).toLocaleString('es', { month: 'long' }),
                ingresos,
                gastosTotal,
                gastosOperativos,
                utilidadOperativa,
                utilidadNeta,
                margenUtilidad: parseFloat(margenUtilidad.toFixed(2))
            });
        }
        return {
            año: añoActual,
            totalInversionInicial,
            meses
        };
    }
    async getKPIsFinancieros(fechaInicio, fechaFin) {
        const resumen = await this.getResumenFinanciero(fechaInicio, fechaFin);
        const promedioGastoDiario = fechaInicio && fechaFin ?
            this.calcularPromedioGastoDiario(resumen.totalGastos, fechaInicio, fechaFin) : 0;
        const promedioIngresoDiario = fechaInicio && fechaFin ?
            this.calcularPromedioIngresoDiario(resumen.totalIngresos, fechaInicio, fechaFin) : 0;
        return Object.assign(Object.assign({}, resumen), { promedioGastoDiario: parseFloat(promedioGastoDiario.toFixed(2)), promedioIngresoDiario: parseFloat(promedioIngresoDiario.toFixed(2)), ratioIngresoGasto: resumen.totalGastos > 0 ?
                parseFloat((resumen.totalIngresos / resumen.totalGastos).toFixed(2)) : 0 });
    }
    async getDashboardKpis() {
        try {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            const fechaInicio = startOfMonth.toISOString().split('T')[0];
            const fechaFin = endOfMonth.toISOString().split('T')[0];
            const entradasDelMes = await this.entradasProduccionService.findByDateRange(fechaInicio, fechaFin);
            const produccionTotal = entradasDelMes.reduce((total, entrada) => total + entrada.unidades, 0);
            const ingresosDelMes = await this.ingresosService.getTotalIngresosByDateRange(fechaInicio, fechaFin);
            const resumenInventario = await this.inventarioResumenService.getInventarioResumen();
            const inventarioActual = Object.values(resumenInventario).reduce((total, item) => {
                return total + (item.stockActual || 0);
            }, 0);
            const galpones = await this.galponesService.findAll();
            const galponesActivos = galpones.filter(g => g.activo).length;
            const totalGalpones = galpones.length;
            const gallinasTotal = galpones.reduce((total, galpon) => total + (galpon.capacidad || 0), 0);
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
    async setInversionInicial(inversionData) {
        try {
            const resultado = await this.gastosService.createOrUpdateInversionInicial(inversionData.montoTotal, inversionData.fechaInicio, inversionData.metaRecuperacion);
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
    async getDatosDiarios(fechaInicio, fechaFin) {
        try {
            let inicio = fechaInicio;
            let fin = fechaFin;
            if (!inicio || !fin) {
                const ahora = new Date();
                const año = ahora.getFullYear();
                const mes = ahora.getMonth();
                const primerDia = new Date(año, mes, 1);
                const ultimoDia = new Date(año, mes + 1, 0);
                inicio = primerDia.toISOString().split('T')[0];
                fin = ultimoDia.toISOString().split('T')[0];
            }
            const ingresosDiarios = await this.ingresosService.getIngresosDiarios(inicio, fin);
            const produccionDiaria = await this.entradasProduccionService.getProduccionDiaria(inicio, fin);
            const salidasDiarias = await this.salidasService.getSalidasDiarias(inicio, fin);
            const canastasDiarias = await this.salidasService.getCanastasDiarias(inicio, fin);
            const gastosDiarios = await this.gastosService.getGastosDiarios(inicio, fin);
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
            console.error('Error getting daily data:', error);
            throw error;
        }
    }
};
exports.FinanzasController = FinanzasController;
__decorate([
    (0, common_1.Get)('resumen'),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FinanzasController.prototype, "getResumenFinanciero", null);
__decorate([
    (0, common_1.Get)('comparativo-mensual'),
    __param(0, (0, common_1.Query)('año')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinanzasController.prototype, "getComparativoMensual", null);
__decorate([
    (0, common_1.Get)('kpis'),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FinanzasController.prototype, "getKPIsFinancieros", null);
__decorate([
    (0, common_1.Get)('dashboard-kpis'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FinanzasController.prototype, "getDashboardKpis", null);
__decorate([
    (0, common_1.Post)('inversion-inicial'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FinanzasController.prototype, "setInversionInicial", null);
__decorate([
    (0, common_1.Get)('datos-diarios'),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
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