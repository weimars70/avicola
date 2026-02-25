import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Galpon } from '../../galpones/entities/galpon.entity';
import { TipoHuevo } from '../../tipos-huevo/entities/tipo-huevo.entity';
import { User } from '../../users/entities/user.entity';

@Entity('entradas_produccion')
export class EntradaProduccion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  galponId: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column()
  tipoHuevoId: string;

  @Column({ type: 'int' })
  unidades: number;

  @Column({ nullable: false })
  id_empresa: number;

  @Column({ type: 'uuid', nullable: true })
  id_usuario_inserta: string;

  @Column({ type: 'uuid', nullable: true })
  id_usuario_actualiza: string;

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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario_inserta' })
  usuarioInserta: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario_actualiza' })
  usuarioActualiza: User;
}