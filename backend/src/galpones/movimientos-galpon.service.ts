import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleGalpon, TipoMovimiento } from './entities/detalle-galpon.entity';
import { CreateDetalleGalponDto } from './dto/create-detalle-galpon.dto';
import { UpdateDetalleGalponDto } from './dto/update-detalle-galpon.dto';
import { Galpon } from './entities/galpon.entity';

@Injectable()
export class MovimientosGalponService {
    private readonly logger = new Logger(MovimientosGalponService.name);

    constructor(
        @InjectRepository(DetalleGalpon)
        private detallesRepository: Repository<DetalleGalpon>,
        @InjectRepository(Galpon)
        private galponesRepository: Repository<Galpon>,
    ) { }

    async create(createDto: CreateDetalleGalponDto, id_empresa: number, id_usuario: string): Promise<DetalleGalpon> {
        const galpon = await this.galponesRepository.findOne({
            where: { id: createDto.id_galpon, id_empresa, activo: true }
        });

        if (!galpon) {
            throw new NotFoundException(`Galpón con ID ${createDto.id_galpon} no encontrado`);
        }

        const detalle = this.detallesRepository.create({
            ...createDto,
            id_empresa,
            id_usuario_inserta: id_usuario,
        });

        return await this.detallesRepository.save(detalle);
    }

    async findByGalpon(id_galpon: string, id_empresa: number): Promise<DetalleGalpon[]> {
        return await this.detallesRepository.find({
            where: { id_galpon, id_empresa },
            order: { fecha: 'DESC', createdAt: 'DESC' },
            relations: ['usuarioInserta', 'usuarioActualiza']
        });
    }

    async findOne(id: string, id_empresa: number): Promise<DetalleGalpon> {
        const detalle = await this.detallesRepository.findOne({
            where: { id, id_empresa },
            relations: ['usuarioInserta']
        });

        if (!detalle) {
            throw new NotFoundException(`Detalle con ID ${id} no encontrado`);
        }

        return detalle;
    }

    async update(id: string, updateDto: UpdateDetalleGalponDto, id_empresa: number, id_usuario: string): Promise<DetalleGalpon> {
        const detalle = await this.findOne(id, id_empresa);

        Object.assign(detalle, updateDto);
        detalle.id_usuario_actualiza = id_usuario;
        detalle.updatedAt = new Date();

        return await this.detallesRepository.save(detalle);
    }

    async remove(id: string, id_empresa: number): Promise<void> {
        const detalle = await this.findOne(id, id_empresa);
        await this.detallesRepository.remove(detalle);
    }

    async getPoblacionActual(id_galpon: string, id_empresa: number): Promise<number> {
        const detalles = await this.detallesRepository.find({
            where: { id_galpon, id_empresa }
        });

        return detalles.reduce((total, det) => {
            return det.tipo === TipoMovimiento.SUMA ? total + det.cantidad : total - det.cantidad;
        }, 0);
    }
}
