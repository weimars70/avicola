import { ActividadesService } from './actividades.service';
export declare class ActividadesController {
    private readonly actividadesService;
    constructor(actividadesService: ActividadesService);
    getActividadesRecientes(id_empresa: number, limit?: string): Promise<import("./actividades.service").ActividadReciente[]>;
}
