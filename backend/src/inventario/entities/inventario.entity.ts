import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, Unique } from 'typeorm';
import { TipoHuevo } from '../../tipos-huevo/entities/tipo-huevo.entity';
import { User } from '../../users/entities/user.entity';

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

  @Column({ type: 'uuid', nullable: true })
  id_usuario_inserta: string;

  @Column({ type: 'uuid', nullable: true })
  id_usuario_actualiza: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
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