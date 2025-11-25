export declare class ConsumoHuevoDto {
    tipoHuevoId: string;
    unidades: number;
}
export declare class CreateConsumoPropioDto {
    descripcion: string;
    fecha: string;
    observaciones?: string;
    huevosConsumidos: ConsumoHuevoDto[];
    activo?: boolean;
    id_empresa?: number;
    id_usuario_inserta?: string;
}
