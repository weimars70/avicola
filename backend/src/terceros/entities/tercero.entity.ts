import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'; 
 
@Entity('terceros', { schema: 'public' }) 
export class Tercero { 
  @PrimaryGeneratedColumn() 
  codigo: number;

  @Column({ name: 'id_empresa', type: 'int', nullable: false }) 
  idEmpresa: number;

  @Column({ name: 'ciudad_codigo' }) 
  ciudadCodigo: string; 

  @Column({ nullable: true }) 
  identificacion: string; 

  @Column({ type: 'int', nullable: true }) 
  dv: number; 

  @Column({ nullable: true }) 
  nombres: string; 

  @Column({ name: 'primer_apellido', nullable: true }) 
  primerApellido: string; 

  @Column({ name: 'segundo_apellido', nullable: true }) 
  segundoApellido: string; 

  @Column() 
  nombre: string; 

  @Column({ nullable: true }) 
  direccion: string; 

  @Column({ nullable: true }) 
  telefono: string; 

  @Column({ nullable: true }) 
  email: string; 

  @Column({ name: 'estrato_codigo' }) 
  estratoCodigo: number; 

  @Column({ nullable: true }) 
  regimen: number; 

  @Column({ nullable: true, name: 'tipo_ident' }) 
  tipoIdent: number; 

  @Column({ nullable: true, name: 'tipo_impuesto' }) 
  tipoImpuesto: number; 

  @Column({ default: false }) 
  cliente: boolean; 

  @Column({ default: false }) 
  proveedor: boolean; 

  @Column({ default: true }) 
  activo: boolean; 
}