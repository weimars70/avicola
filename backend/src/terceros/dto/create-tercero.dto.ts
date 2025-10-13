import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; 
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
 
export class CreateTerceroDto { 
  // Campos opcionales que pueden venir del frontend
  @IsOptional() 
  @IsNumber()
  codigo?: number; 

  @IsOptional() 
  @IsNumber()
  id?: number;

  @IsOptional() 
  @IsNumber()
  tipoIdent?: number; 

  @IsOptional() 
  @IsNumber()
  tipo_ident?: number;

  @IsString()
  identificacion: string; 
 
  @IsOptional() 
  @IsNumber()
  dv?: number; 
 
  @IsOptional() 
  @IsString()
  nombres?: string; 
 
  @IsOptional() 
  @IsString()
  primerApellido?: string; 
 
  @IsOptional() 
  @IsString()
  segundoApellido?: string; 
 
  @IsString()
  nombre: string; 
 
  @IsOptional() 
  @IsString()
  ciudadCodigo?: string; 
 
  @IsOptional() 
  @IsString()
  direccion?: string; 
 
  @IsOptional() 
  @IsString()
  telefono?: string; 
 
  @IsOptional() 
  @IsString()
  email?: string; 

  @IsOptional() 
  @IsString()
  contacto?: string;
 
  @IsOptional() 
  @IsNumber()
  estratoCodigo?: number; 

  @IsOptional() 
  @IsNumber()
  estrato_codigo?: number;
 
  @IsOptional() 
  @IsNumber()
  regimen?: number; 
 
  @IsOptional() 
  @IsNumber()
  tipoImpuesto?: number; 

  @IsOptional() 
  @IsNumber()
  tipo_impuesto?: number;

  @IsOptional() 
  @IsString()
  observaciones?: string;
 
  @IsOptional() 
  @IsBoolean()
  cliente?: boolean; 
 
  @IsOptional() 
  @IsBoolean()
  proveedor?: boolean; 
 
  @IsOptional() 
  @IsBoolean()
  activo?: boolean; 

  @IsOptional() 
  @IsNumber()
  idEmpresa?: number;
} 
 
export class UpdateTerceroDto extends CreateTerceroDto {}