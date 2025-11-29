import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('inventario_terceros', { schema: 'public' })
export class InventarioTerceros {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_empresa', type: 'int' })
  idEmpresa: number;

  @Column({ name: 'id_tercero', type: 'int' })
  idTercero: number;

  @Column({ name: 'tipo_huevo_codigo', type: 'varchar', length: 50 })
  tipoHuevoCodigo: string;

  @Column({ name: 'cantidad', type: 'int' })
  cantidad: number;

  @Column({ name: 'tipo_movimiento', type: 'varchar', length: 10 })
  tipoMovimiento: string; // entrada | salida | ajuste | devolucion

  @Column({ name: 'precio_unitario', type: 'decimal', precision: 15, scale: 2, default: 0 })
  precioUnitario: number;

  @Column({ name: 'valor_total', type: 'decimal', precision: 15, scale: 2, default: 0 })
  valorTotal: number;

  @Column({ name: 'id_movimiento_financiero', type: 'int', nullable: true })
  idMovimientoFinanciero?: number;

  @Column({ name: 'id_compra', type: 'int', nullable: true })
  idCompra?: number;

  @Column({ name: 'id_venta', type: 'int', nullable: true })
  idVenta?: number;

  @Column({ name: 'lote', type: 'varchar', length: 50, nullable: true })
  lote?: string;

  @Column({ name: 'fecha_movimiento', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaMovimiento: Date;

  @Column({ name: 'concepto', type: 'varchar', length: 255, nullable: true })
  concepto?: string;

  @Column({ name: 'descripcion', type: 'text', nullable: true })
  descripcion?: string;

  @Column({ name: 'stock_anterior', type: 'int', default: 0 })
  stockAnterior: number;

  @Column({ name: 'stock_actual', type: 'int', default: 0 })
  stockActual: number;

  @Column({ name: 'activo', type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
