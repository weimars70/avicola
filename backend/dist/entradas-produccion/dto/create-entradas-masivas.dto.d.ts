export declare class EntradaProduccionItem {
    tipoHuevoId: string;
    unidades: number;
}
export declare class CreateEntradasMasivasDto {
    galponId: string;
    fecha: string;
    entradas: EntradaProduccionItem[];
    id_empresa?: number;
    id_usuario_inserta?: string;
}
