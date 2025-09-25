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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActividadesService = void 0;
const common_1 = require("@nestjs/common");
const gastos_service_1 = require("./gastos.service");
const salidas_service_1 = require("../salidas/salidas.service");
const entradas_produccion_service_1 = require("../entradas-produccion/entradas-produccion.service");
let ActividadesService = class ActividadesService {
    constructor(gastosService, salidasService, entradasProduccionService) {
        this.gastosService = gastosService;
        this.salidasService = salidasService;
        this.entradasProduccionService = entradasProduccionService;
    }
    async getActividadesRecientes(limit = 10) {
        const actividades = [];
        try {
            const entradas = await this.entradasProduccionService.findAll();
            const entradasRecientes = entradas.slice(0, 20);
            entradasRecientes.forEach(entrada => {
                var _a, _b;
                actividades.push({
                    id: `entrada-${entrada.id}`,
                    descripcion: `Entrada de ${entrada.unidades} ${((_a = entrada.tipoHuevo) === null || _a === void 0 ? void 0 : _a.nombre) || 'huevos'} en ${((_b = entrada.galpon) === null || _b === void 0 ? void 0 : _b.nombre) || 'galpón'}`,
                    fecha: entrada.createdAt,
                    tipo: 'entrada',
                    icon: 'arrow_downward',
                    color: 'positive'
                });
            });
            const salidas = await this.salidasService.findAll();
            const salidasRecientes = salidas.slice(0, 20);
            salidasRecientes.forEach(salida => {
                var _a, _b;
                const valorTotal = salida.unidades * (((_a = salida.canasta) === null || _a === void 0 ? void 0 : _a.valorCanasta) || 0);
                actividades.push({
                    id: `salida-${salida.id}`,
                    descripcion: `Salida de ${salida.unidades} canastas de ${((_b = salida.tipoHuevo) === null || _b === void 0 ? void 0 : _b.nombre) || 'huevos'}`,
                    fecha: salida.createdAt,
                    tipo: 'salida',
                    icon: 'arrow_upward',
                    color: 'negative',
                    monto: valorTotal
                });
            });
            const gastos = await this.gastosService.findAll();
            const gastosRecientes = gastos.slice(0, 20);
            gastosRecientes.forEach(gasto => {
                var _a;
                actividades.push({
                    id: `gasto-${gasto.id}`,
                    descripcion: `Gasto: ${gasto.descripcion} - ${((_a = gasto.categoria) === null || _a === void 0 ? void 0 : _a.nombre) || 'Sin categoría'}`,
                    fecha: new Date(gasto.fecha),
                    tipo: 'gasto',
                    icon: 'payment',
                    color: 'warning',
                    monto: gasto.monto
                });
            });
            return actividades
                .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
                .slice(0, limit);
        }
        catch (error) {
            console.error('Error obteniendo actividades recientes:', error);
            return [];
        }
    }
};
exports.ActividadesService = ActividadesService;
exports.ActividadesService = ActividadesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gastos_service_1.GastosService,
        salidas_service_1.SalidasService,
        entradas_produccion_service_1.EntradasProduccionService])
], ActividadesService);
//# sourceMappingURL=actividades.service.js.map