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
exports.ResumenService = void 0;
const common_1 = require("@nestjs/common");
const gastos_service_1 = require("./gastos.service");
const salidas_service_1 = require("../salidas/salidas.service");
const ingresos_service_1 = require("./ingresos.service");
let ResumenService = class ResumenService {
    constructor(gastosService, salidasService, ingresosService) {
        this.gastosService = gastosService;
        this.salidasService = salidasService;
        this.ingresosService = ingresosService;
    }
    async getResumenFinanciero() {
        const totalGastos = await this.gastosService.getTotalGastos();
        const totalGastosOperativos = await this.gastosService.getTotalGastosExcluyendoInversion();
        const totalInversionInicial = await this.gastosService.getTotalInversionInicial();
        const ingresos = await this.ingresosService.syncIngresosFromSalidas();
        const totalIngresos = await this.ingresosService.getTotalIngresos();
        const gastos = await this.gastosService.findAll();
        const salidas = await this.salidasService.findAll();
        const utilidadOperativa = totalIngresos - totalGastosOperativos;
        const utilidadNeta = totalIngresos - totalGastos;
        const recuperacionInversion = totalInversionInicial > 0 ? (utilidadOperativa / totalInversionInicial) * 100 : 0;
        return {
            totalGastos,
            totalGastosOperativos,
            totalInversionInicial,
            totalIngresos,
            utilidadOperativa,
            utilidadNeta,
            recuperacionInversion: parseFloat(recuperacionInversion.toFixed(2)),
            gastos,
            salidas
        };
    }
};
exports.ResumenService = ResumenService;
exports.ResumenService = ResumenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [gastos_service_1.GastosService,
        salidas_service_1.SalidasService,
        ingresos_service_1.IngresosService])
], ResumenService);
//# sourceMappingURL=resumen.service.js.map