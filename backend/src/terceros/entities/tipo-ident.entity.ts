import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('tipo_ident', { schema: 'public' })
export class TipoIdent {
  @PrimaryColumn()
  codigo: number;

  @Column()
  nombre: string;
  
  @Column({ nullable: true })
  abreviado: string;
}