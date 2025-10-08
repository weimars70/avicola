import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AjusteInventario } from './ajuste-inventario.entity';

@Entity('ajustes_lote')
export class AjusteLote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  descripcionGeneral: string;

  @Column()
  usuarioId: string;

  @Column({ type: 'integer', default: 1 })
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
  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuarioId' })
  usuario: User;

  @OneToMany(() => AjusteInventario, ajuste => ajuste.ajusteLote)
  ajustes: AjusteInventario[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario_inserta' })
  usuarioInserta: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario_actualiza' })
  usuarioActualiza: User;
}