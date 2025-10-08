import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TipoHuevo } from '../../tipos-huevo/entities/tipo-huevo.entity';
import { User } from '../../users/entities/user.entity';

@Entity('canastas')
export class Canasta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valorCanasta: number;

  @Column({ type: 'int' })
  unidadesPorCanasta: number;

  @ManyToOne(() => TipoHuevo)
  @JoinColumn({ name: 'tipoHuevoId' })
  tipoHuevo: TipoHuevo;

  @Column()
  tipoHuevoId: string;

  @Column({ type: 'int' })
  id_empresa: number;

  @Column({ type: 'uuid', nullable: true })
  id_usuario_inserta: string;

  @Column({ type: 'uuid', nullable: true })
  id_usuario_actualiza: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario_inserta' })
  usuarioInserta: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario_actualiza' })
  usuarioActualiza: User;
}