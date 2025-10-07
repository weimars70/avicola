export declare class AjusteItemDto {
    tipoHuevoId: string;
    cantidadAjuste: number;
    tipoAjuste: 'suma' | 'resta';
    descripcion?: string;
}
export declare class CreateAjusteLoteDto {
    descripcionGeneral: string;
    usuarioId: string;
    ajustes: AjusteItemDto[];
}
