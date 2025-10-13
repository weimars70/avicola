// src/types/terceros.ts 

export interface Ciudad { 
  codigo: string; 
  nombre: string; 
} 

export interface Estrato { 
  codigo: number; 
  nombre: string; 
} 

export interface TipoRegimen { 
  codigo: number; 
  nombre: string; 
  code: string; 
} 

export interface TipoIdent { 
  codigo: number; 
  nombre: string; 
  abreviado?: string;  // NOTA: en la BD es "abreviado" NO "abreviatura" 
} 

export interface TipoImpuesto { 
  codigo: number; 
  nombre: string; 
  code: string; 
} 

export interface Tercero { 
  // IDs 
  codigo?: number; 
  id?: number; 
  
  // Campos principales 
  ciudadCodigo?: string; 
  ciudad_codigo?: string; 
  identificacion: string; 
  dv?: number | null; 
  nombres?: string; 
  primerApellido?: string; 
  primer_apellido?: string; 
  segundoApellido?: string; 
  segundo_apellido?: string; 
  nombre: string; 
  direccion?: string; 
  telefono?: string; 
  email?: string; 
  contacto?: string;
  observaciones?: string;
  
  // IDs de relaciones (números) 
  estratoCodigo?: number | null; 
  estrato_codigo?: number; 
  regimen?: number | null; 
  tipoIdentId?: number;
  tipoIdent?: number | null;
  tipo_ident?: number; 
  tipoImpuestoId?: number;
  tipoImpuesto?: number | null;
  tipo_impuesto?: number; 
  
  // Booleanos 
  cliente: boolean; 
  proveedor: boolean; 
  activo: boolean;
  
  // Empresa
  idEmpresa?: number;
  
  // Timestamps 
  createdAt?: string; 
  updatedAt?: string; 
  
  // Relaciones (objetos completos) 
  ciudad?: Ciudad; 
  estrato?: Estrato; 
  tipoRegimen?: TipoRegimen; 
  tipoIdentObj?: TipoIdent;  // Cambié el nombre para evitar duplicado 
  tipoImpuestoObj?: TipoImpuesto; 
}

// Interfaz para el estado de Terceros en Pinia
export interface TercerosState {
  terceros: Tercero[];
  loading: boolean;
  error: string | null;
  ciudades: Ciudad[];
  estratos: Estrato[];
  regimenes: TipoRegimen[];
  tiposIdentificacion: TipoIdent[];
  tiposImpuesto: TipoImpuesto[];
}