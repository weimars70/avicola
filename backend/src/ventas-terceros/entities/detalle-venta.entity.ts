import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Venta } from './venta.entity';
import { Canasta } from '../../canastas/entities/canasta.entity';

@Entity('detalle_ventas')
export class DetalleVenta {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'id_venta' })
    idVenta: string;

    @Column({ name: 'id_producto', nullable: true })
    idProducto: string;

    @Column({ nullable: true })
    descripcion: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 1 })
    cantidad: number;

    @Column({ name: 'precio_unitario', type: 'decimal', precision: 10, scale: 2 })
    precioUnitario: number;

    // Columna generada - no se mapea en TypeORM, se calcula en BD
    // @Column({ type: 'decimal', precision: 10, scale: 2, generatedType: 'STORED', asExpression: '(cantidad * precio_unitario)' })
    // subtotal: number;

    @Column({ name: 'canasta_id' })
    canastaId: string;

    @Column({ nullable: true, length: 50 })
    codigo: string;

    @Column({ name: 'fecha_inserta', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fechaInserta: Date;

    @Column({ name: 'inventario_origen', default: 1 })
    inventarioOrigen: number; // 1 = inventario normal, 2 = inventario terceros

    // Relaciones
    @ManyToOne(() => Venta, venta => venta.detalles, { onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'id_venta' })
    venta: Venta;

    @ManyToOne(() => Canasta, { onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'canasta_id' })
    canasta: Canasta;
}
