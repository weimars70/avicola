import { ActividadesService, ActividadReciente } from './actividades.service';
export declare class ActividadesController {
    private readonly actividadesService;
    constructor(actividadesService: ActividadesService);
    getActividadesRecientes(limit?: string): Promise<ActividadReciente[]>;
}
