import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, UpdateDateColumn } from 'typeorm';
import { Galpon } from './galpon.entity';
import { User } from '../../users/entities/user.entity';

export enum TipoMovimiento {
    SUMA = 'SUMA',
    RESTA = 'RESTA'
}

@Entity('detalles_galpones')
export class DetalleGalpon {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    id_galpon: string;

    @Column({
        type: 'varchar',
        length: 10,
        enum: TipoMovimiento
    })
    tipo: TipoMovimiento;

    @Column({ type: 'int' })
    cantidad: number;

    @Column()
    motivo: string;

    @Column({ type: 'text', nullable: true })
    comentario: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fecha: Date;

    @Column({ nullable: false })
    id_empresa: number;

    @Column({ type: 'uuid', nullable: false })
    id_usuario_inserta: string;

    @Column({ type: 'uuid', nullable: true })
    id_usuario_actualiza: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Relaciones
    @ManyToOne(() => Galpon)
    @JoinColumn({ name: 'id_galpon' })
    galpon: Galpon;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'id_usuario_inserta' })
    usuarioInserta: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'id_usuario_actualiza' })
    usuarioActualiza: User;
}
