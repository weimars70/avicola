import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('estratos', { schema: 'public' })
export class Estrato {
  @PrimaryColumn()
  codigo: number;

  @Column()
  nombre: string;
  
  @Column({ name: 'id_empresa', nullable: true })
  idEmpresa?: number;
}