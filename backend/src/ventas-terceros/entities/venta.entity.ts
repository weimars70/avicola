import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Tercero } from '../../terceros/entities/tercero.entity';
import { DetalleVenta } from './detalle-venta.entity';

@Entity('ventas')
export class Venta {
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

    @Column({ name: 'numero_factura', nullable: true, length: 50 })
    numeroFactura: string;

    @Column({ name: 'forma_pago', nullable: true, length: 50 })
    formaPago: string;

    @Column({ type: 'text', nullable: true })
    observaciones: string;

    @Column({ name: 'tipo_movimiento', default: 2 })
    tipoMovimiento: number; // 1 = normal, 2 = terceros

    @Column({ default: 'PENDIENTE', length: 20 })
    estado: string; // PENDIENTE, PAGADO, PARCIAL

    @Column({ name: 'createdat', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ name: 'updatedat', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    @Column({ name: 'fecha_inserta', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fechaInserta: Date;

    @Column({ name: 'fecha_actualiza', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    fechaActualiza: Date;

    // Relaciones
    @ManyToOne(() => Tercero)
    @JoinColumn({ name: 'id_tercero', referencedColumnName: 'codigo' })
    tercero: Tercero;

    @OneToMany(() => DetalleVenta, detalle => detalle.venta, { cascade: true })
    detalles: DetalleVenta[];
}
