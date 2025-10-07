import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Salida } from '../../salidas/entities/salida.entity';

@Entity('ingresos')
export class Ingreso {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'varchar', length: 255 })
  descripcion: string;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @Column({ type: 'varchar', length: 50, default: 'venta' })
  tipo: string; // 'venta', 'otro'

  @Column({ type: 'varchar', length: 100, nullable: true })
  referencia?: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @Column({ type: 'int', nullable: false })
  id_empresa: number;

  // Relación con Salida (para ingresos por ventas)
  @Column({ type: 'uuid', nullable: true })
  salidaId?: string;

  @ManyToOne(() => Salida, { nullable: true, eager: true })
  @JoinColumn({ name: 'salidaId' })
  salida?: Salida;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}