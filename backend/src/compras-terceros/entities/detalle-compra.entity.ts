import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Compra } from './compra.entity';
import { TipoHuevo } from '../../tipos-huevo/entities/tipo-huevo.entity';
import { Canasta } from '../../canastas/entities/canasta.entity';

@Entity('detalle_compras')
export class DetalleCompra {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'id_compra' })
    idCompra: string;

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

    @Column({ name: 'tipo_huevo_id', nullable: true })
    tipoHuevoId: string;

    @Column({ name: 'canasta_id', nullable: true })
    canastaId: string;

    @Column({ name: 'tipo_movimiento', default: 1 })
    tipoMovimiento: number; // 1 = normal, 2 = terceros

    

    // Relaciones
    @ManyToOne(() => Compra, compra => compra.detalles, { onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'id_compra' })
    compra: Compra;

    @ManyToOne(() => TipoHuevo, { onDelete: 'NO ACTION' })
    @JoinColumn({ name: 'tipo_huevo_id' })
    tipoHuevo: TipoHuevo;

    @ManyToOne(() => Canasta, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'canasta_id' })
    canasta: Canasta;
}
