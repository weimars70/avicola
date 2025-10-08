import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TipoHuevo } from '../../tipos-huevo/entities/tipo-huevo.entity';
import { User } from '../../users/entities/user.entity';
import { AjusteLote } from './ajuste-lote.entity';

@Entity('ajustes_inventario')
export class AjusteInventario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tipoHuevoId: string;

  @Column({ type: 'int' })
  cantidadAnterior: number;

  @Column({ type: 'int' })
  cantidadAjuste: number;

  @Column({ type: 'int' })
  cantidadNueva: number;

  @Column({ type: 'enum', enum: ['suma', 'resta'] })
  tipoAjuste: 'suma' | 'resta';

  @Column({ type: 'text' })
  descripcion: string;

  @Column()
  usuarioId: string;

  @Column({ nullable: true })
  ajusteLoteId: string;

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
  @ManyToOne(() => TipoHuevo)
  @JoinColumn({ name: 'tipoHuevoId' })
  tipoHuevo: TipoHuevo;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuarioId' })
  usuario: User;

  @ManyToOne(() => AjusteLote, lote => lote.ajustes)
  @JoinColumn({ name: 'ajusteLoteId' })
  ajusteLote: AjusteLote;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario_inserta' })
  usuarioInserta: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_usuario_actualiza' })
  usuarioActualiza: User;
}