import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('rendimientos')
export class Rendimiento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalIngresos: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalGastos: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  utilidadNeta: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  margenUtilidad: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  roi: number; // Return on Investment

  @Column({ type: 'varchar', length: 20 })
  periodo: string; // 'diario', 'semanal', 'mensual', 'anual'

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}