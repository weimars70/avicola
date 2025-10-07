import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('galpones')
export class Galpon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ type: 'int' })
  capacidad: number;

  @Column({ default: true })
  activo: boolean;
  
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
}