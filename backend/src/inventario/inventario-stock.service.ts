import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from './entities/inventario.entity';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';

@Injectable()
export class InventarioStockService {
  constructor(
    @InjectRepository(Inventario)
    private inventarioRepository: Repository<Inventario>,
  ) {}

  async create(createInventarioDto: CreateInventarioDto): Promise<Inventario> {
    const inventario = this.inventarioRepository.create(createInventarioDto);
    return await this.inventarioRepository.save(inventario);
  }

  async findAll(id_empresa: number): Promise<Inventario[]> {
    return await this.inventarioRepository.find({
      where: { id_empresa },
      relations: ['tipoHuevo'],
      order: { tipoHuevo: { nombre: 'ASC' } },
    });
  }

  async findByTipoHuevo(tipoHuevoId: string, id_empresa: number): Promise<Inventario | null> {
    return await this.inventarioRepository.findOne({
      where: { tipoHuevoId, id_empresa },
      relations: ['tipoHuevo'],
    });
  }



  async findOne(id: number): Promise<Inventario> {
    const inventario = await this.inventarioRepository.findOne({
      where: { id },
      relations: ['tipoHuevo'],
    });

    if (!inventario) {
      throw new NotFoundException(`Inventario con ID ${id} no encontrado`);
    }

    return inventario;
  }

  async update(id: number, updateInventarioDto: UpdateInventarioDto): Promise<Inventario> {
    const inventario = await this.findOne(id);
    Object.assign(inventario, updateInventarioDto);
    return await this.inventarioRepository.save(inventario);
  }

  async remove(id: number): Promise<void> {
    const inventario = await this.findOne(id);
    await this.inventarioRepository.remove(inventario);
  }

  // Método principal para actualizar inventario desde entradas de producción
  async actualizarInventario(tipoHuevoId: string, unidadesAgregar: number, id_empresa: number = 1): Promise<Inventario> {
    const inventarioExistente = await this.findByTipoHuevo(tipoHuevoId, id_empresa);

    if (inventarioExistente) {
      // Actualizar inventario existente
      inventarioExistente.unidades += unidadesAgregar;
      return await this.inventarioRepository.save(inventarioExistente);
    } else {
      // Crear nuevo registro de inventario
      const nuevoInventario = this.inventarioRepository.create({
        tipoHuevoId,
        unidades: unidadesAgregar,
        id_empresa,
      });
      return await this.inventarioRepository.save(nuevoInventario);
    }
  }

  // Método para reducir inventario (para salidas)
  async reducirInventario(tipoHuevoId: string, unidadesReducir: number, id_empresa: number = 1): Promise<Inventario> {
    const inventarioExistente = await this.findByTipoHuevo(tipoHuevoId, id_empresa);

    if (!inventarioExistente) {
      throw new NotFoundException(`No hay inventario para el tipo de huevo ${tipoHuevoId}`);
    }

    if (inventarioExistente.unidades < unidadesReducir) {
      throw new Error(`No hay suficientes unidades en inventario. Disponible: ${inventarioExistente.unidades}, Solicitado: ${unidadesReducir}`);
    }

    inventarioExistente.unidades -= unidadesReducir;
    return await this.inventarioRepository.save(inventarioExistente);
  }



  // Método para aumentar stock (para correcciones o devoluciones)
  async aumentarStock(tipoHuevoId: string, unidadesAumentar: number, id_empresa: number = 1): Promise<Inventario> {
    return this.actualizarInventario(tipoHuevoId, unidadesAumentar, id_empresa);
  }

  // Método para reducir stock (para salidas)
  async reducirStock(tipoHuevoId: string, unidadesReducir: number, id_empresa: number = 1): Promise<Inventario> {
    return this.reducirInventario(tipoHuevoId, unidadesReducir, id_empresa);
  }

  // Método para obtener vista de inventario con valores calculados
  async getVistaInventario(id_empresa: number): Promise<any[]> {
    const inventarios = await this.inventarioRepository.find({
      relations: ['tipoHuevo'],
      where: { id_empresa },
      order: { unidades: 'DESC' }
    });

    return inventarios.map(item => ({
      id: item.id,
      unidades: item.unidades,
      valorTotal: item.unidades * item.tipoHuevo.valorUnidad,
      tipoHuevo: {
        id: item.tipoHuevo.id,
        nombre: item.tipoHuevo.nombre,
        valorUnidad: item.tipoHuevo.valorUnidad
      }
    }));
  }
}