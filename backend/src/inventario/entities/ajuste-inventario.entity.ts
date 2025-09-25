import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
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

  @CreateDateColumn()
  createdAt: Date;

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
}