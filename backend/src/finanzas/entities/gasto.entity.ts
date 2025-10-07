import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CategoriaGasto } from './categoria-gasto.entity';

@Entity('gastos')
export class Gasto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ nullable: true })
  observaciones: string;

  @Column({ nullable: true })
  numeroFactura: string;

  @Column({ nullable: true })
  proveedor: string;

  @Column({ default: true })
  activo: boolean;

  @ManyToOne(() => CategoriaGasto, categoria => categoria.gastos)
  @JoinColumn({ name: 'categoriaId' })
  categoria: CategoriaGasto;

  @Column()
  categoriaId: number;

  @Column({ nullable: true })
  id_empresa: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}