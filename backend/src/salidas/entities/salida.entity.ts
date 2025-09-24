import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TipoHuevo } from '../../tipos-huevo/entities/tipo-huevo.entity';
import { Canasta } from '../../canastas/entities/canasta.entity';

@Entity('salidas')
export class Salida {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tipoHuevoId: string;

  @Column({ nullable: true })
  canastaId: string;

  @Column({ nullable: true })
  nombreComprador: string;

  @Column({ type: 'int' })
  unidades: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  valor?: number;

  @Column({ type: 'date', nullable: true })
  fecha?: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => TipoHuevo)
  @JoinColumn({ name: 'tipoHuevoId' })
  tipoHuevo: TipoHuevo;

  @ManyToOne(() => Canasta, { nullable: true })
  @JoinColumn({ name: 'canastaId' })
  canasta: Canasta;


}