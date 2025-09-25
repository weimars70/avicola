import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToMany } from 'typeorm';
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

  @CreateDateColumn()
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => User)
  @JoinColumn({ name: 'usuarioId' })
  usuario: User;

  @OneToMany(() => AjusteInventario, ajuste => ajuste.ajusteLote)
  ajustes: AjusteInventario[];
}