import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Galpon } from '../../galpones/entities/galpon.entity';
import { TipoHuevo } from '../../tipos-huevo/entities/tipo-huevo.entity';

@Entity('entradas_produccion')
export class EntradaProduccion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  galponId: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column()
  tipoHuevoId: string;

  @Column({ type: 'int' })
  unidades: number;

  @Column({ nullable: false })
  id_empresa: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Galpon)
  @JoinColumn({ name: 'galponId' })
  galpon: Galpon;

  @ManyToOne(() => TipoHuevo)
  @JoinColumn({ name: 'tipoHuevoId' })
  tipoHuevo: TipoHuevo;
}