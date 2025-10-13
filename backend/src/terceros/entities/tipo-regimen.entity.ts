import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('tipo_regimen', { schema: 'public' })
export class TipoRegimen {
  @PrimaryColumn()
  codigo: number;

  @Column()
  nombre: string;
  
  @Column()
  code: string;
}