export declare class CreateTerceroDto {
    codigo?: number;
    id?: number;
    tipoIdent?: number;
    tipo_ident?: number;
    identificacion: string;
    dv?: number;
    nombres?: string;
    primerApellido?: string;
    segundoApellido?: string;
    nombre: string;
    ciudadCodigo?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    contacto?: string;
    estratoCodigo?: number;
    estrato_codigo?: number;
    regimen?: number;
    tipoImpuesto?: number;
    tipo_impuesto?: number;
    observaciones?: string;
    cliente?: boolean;
    proveedor?: boolean;
    activo?: boolean;
    idEmpresa?: number;
}
export declare class UpdateTerceroDto extends CreateTerceroDto {
}
