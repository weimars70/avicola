import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('tipo_impuesto', { schema: 'public' })
export class TipoImpuesto {
  @PrimaryColumn()
  codigo: number;

  @Column()
  nombre: string;
  
  @Column()
  code: string;
}