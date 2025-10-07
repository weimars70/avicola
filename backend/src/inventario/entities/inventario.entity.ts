import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { TipoHuevo } from '../../tipos-huevo/entities/tipo-huevo.entity';

@Entity('inventario')
@Unique(['tipoHuevoId', 'id_empresa'])
export class Inventario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_empresa: number;

  @Column()
  tipoHuevoId: string;

  @Column({ type: 'int', default: 0 })
  unidades: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => TipoHuevo)
  @JoinColumn({ name: 'tipoHuevoId' })
  tipoHuevo: TipoHuevo;
}