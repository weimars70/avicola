import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Tercero } from '../../terceros/entities/tercero.entity';
import { DetalleCompra } from './detalle-compra.entity';

@Entity('compras')
export class Compra {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ name: 'id_tercero' })
  idTercero: number;

  @Column({ name: 'id_empresa' })
  idEmpresa: number;

  @Column({ name: 'id_usuario_inserta', nullable: true })
  idUsuarioInserta: string;

  @Column({ default: true })
  activo: boolean;

  @Column({ name: 'numero_factura', nullable: true, length: 20 })
  numeroFactura: string;

  @Column({ default: 'PENDIENTE', length: 20 })
  estado: string;

  @Column({ name: 'forma_pago', nullable: true, length: 50 })
  formaPago: string;

  @Column({ name: 'tipo_movimiento', default: 2 })
  tipoMovimiento: number; // 1 = normal, 2 = terceros

  @Column({ name: 'createdat', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ name: 'updatedat', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Tercero)
  @JoinColumn({ name: 'id_tercero', referencedColumnName: 'codigo' })
  tercero: Tercero;

  @OneToMany(() => DetalleCompra, detalle => detalle.compra)
  detalles: DetalleCompra[];
}
