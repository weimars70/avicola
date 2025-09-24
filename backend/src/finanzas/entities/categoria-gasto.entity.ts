import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Gasto } from './gasto.entity';

@Entity('categorias_gastos')
export class CategoriaGasto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  color: string; // Para identificación visual en gráficos

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => Gasto, gasto => gasto.categoria)
  gastos: Gasto[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}