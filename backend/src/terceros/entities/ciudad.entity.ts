import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('ciudades', { schema: 'public' })
export class Ciudad {
  @PrimaryColumn()
  codigo: string;

  @Column()
  nombre: string;
}