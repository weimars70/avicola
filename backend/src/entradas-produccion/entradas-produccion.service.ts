import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CreateEntradaProduccionDto } from './dto/create-entrada-produccion.dto';
import { UpdateEntradaProduccionDto } from './dto/update-entrada-produccion.dto';
import { CreateEntradasMasivasDto } from './dto/create-entradas-masivas.dto';
import { EntradaProduccion } from './entities/entrada-produccion.entity';
import { Galpon } from '../galpones/entities/galpon.entity';
import { TipoHuevo } from '../tipos-huevo/entities/tipo-huevo.entity';
import { InventarioStockService } from '../inventario/inventario-stock.service';

@Injectable()
export class EntradasProduccionService {
  constructor(
    @InjectRepository(EntradaProduccion)
    private entradasProduccionRepository: Repository<EntradaProduccion>,
    @InjectRepository(Galpon)
    private galponesRepository: Repository<Galpon>,
    @InjectRepository(TipoHuevo)
    private tiposHuevoRepository: Repository<TipoHuevo>,
    private inventarioStockService: InventarioStockService,
  ) { }

  async create(createEntradaProduccionDto: CreateEntradaProduccionDto): Promise<EntradaProduccion> {
    // Validar que el galpón existe y está activo si se proporciona el ID
    if (createEntradaProduccionDto.galponId) {
      const galpon = await this.galponesRepository.findOne({ where: { id: createEntradaProduccionDto.galponId } });
      if (!galpon) {
        throw new NotFoundException(`Galpón con ID ${createEntradaProduccionDto.galponId} no encontrado`);
      }

      // Verificar que el galpón esté activo
      if (!galpon.activo) {
        throw new BadRequestException(`No se pueden registrar entradas en el galpón "${galpon.nombre}" porque está inactivo`);
      }
    }

    // Validar que el tipo de huevo existe
    const tipoHuevo = await this.tiposHuevoRepository.findOne({ where: { id: createEntradaProduccionDto.tipoHuevoId } });
    if (!tipoHuevo) {
      throw new NotFoundException(`Tipo de huevo con ID ${createEntradaProduccionDto.tipoHuevoId} no encontrado`);
    }

    const entradaProduccion = this.entradasProduccionRepository.create({
      ...createEntradaProduccionDto,
      galponId: createEntradaProduccionDto.galponId || null
    });
    const savedEntrada = await this.entradasProduccionRepository.save(entradaProduccion);

    // Actualizar inventario automáticamente
    await this.inventarioStockService.actualizarInventario(
      createEntradaProduccionDto.tipoHuevoId,
      createEntradaProduccionDto.unidades,
      createEntradaProduccionDto.id_empresa
    );

    return savedEntrada;
  }

  async createMasivas(createEntradasMasivasDto: CreateEntradasMasivasDto): Promise<EntradaProduccion[]> {
    // Validar que el galpón existe y está activo si se proporciona el ID
    if (createEntradasMasivasDto.galponId) {
      const galpon = await this.galponesRepository.findOne({ where: { id: createEntradasMasivasDto.galponId } });
      if (!galpon) {
        throw new NotFoundException(`Galpón con ID ${createEntradasMasivasDto.galponId} no encontrado`);
      }

      // Verificar que el galpón esté activo
      if (!galpon.activo) {
        throw new BadRequestException(`No se pueden registrar entradas en el galpón "${galpon.nombre}" porque está inactivo`);
      }
    }

    // Validar que todos los tipos de huevo existen
    const tipoHuevoIds = createEntradasMasivasDto.entradas.map(entrada => entrada.tipoHuevoId);
    const tiposHuevo = await this.tiposHuevoRepository.findByIds(tipoHuevoIds);

    if (tiposHuevo.length !== tipoHuevoIds.length) {
      throw new BadRequestException('Uno o más tipos de huevo no existen');
    }

    // Filtrar entradas con unidades > 0
    const entradasValidas = createEntradasMasivasDto.entradas.filter(entrada => entrada.unidades > 0);

    if (entradasValidas.length === 0) {
      throw new BadRequestException('Debe especificar al menos una entrada con unidades mayor a 0');
    }

    // Crear las entradas de producción
    const entradasProduccion = entradasValidas.map(entrada =>
      this.entradasProduccionRepository.create({
        galponId: createEntradasMasivasDto.galponId || null,
        fecha: createEntradasMasivasDto.fecha,
        tipoHuevoId: entrada.tipoHuevoId,
        unidades: entrada.unidades,
        id_empresa: createEntradasMasivasDto.id_empresa || 1,
        id_usuario_inserta: createEntradasMasivasDto.id_usuario_inserta
      })
    );

    const savedEntradas = await this.entradasProduccionRepository.save(entradasProduccion);

    // Actualizar inventario para cada entrada
    for (const entrada of savedEntradas) {
      await this.inventarioStockService.actualizarInventario(
        entrada.tipoHuevoId,
        entrada.unidades,
        entrada.id_empresa
      );
    }

    return savedEntradas;
  }

  async findAll(id_empresa: number): Promise<EntradaProduccion[]> {
    return await this.entradasProduccionRepository.find({
      where: { id_empresa },
      relations: ['galpon', 'tipoHuevo'],
      order: { fecha: 'DESC' },
    });
  }

  async findByDateRange(fechaInicio: string, fechaFin: string, id_empresa?: number): Promise<EntradaProduccion[]> {
    return this.entradasProduccionRepository.find({
      where: {
        fecha: Between(new Date(fechaInicio), new Date(fechaFin)),
        ...(id_empresa ? { id_empresa, tipoHuevo: { id_empresa } } : {})
      },
      relations: ['galpon', 'tipoHuevo'],
      order: { fecha: 'DESC' }
    });
  }

  async findOne(id: string, id_empresa?: number): Promise<EntradaProduccion> {
    const where: any = { id };
    if (id_empresa) {
      where.id_empresa = id_empresa;
    }

    const entradaProduccion = await this.entradasProduccionRepository.findOne({
      where,
      relations: ['galpon', 'tipoHuevo']
    });

    if (!entradaProduccion) {
      throw new NotFoundException(`Entrada de producción con ID ${id} no encontrada`);
    }

    // Trigger re-compile
    return entradaProduccion;
  }

  async update(id: string, updateEntradaProduccionDto: UpdateEntradaProduccionDto, id_empresa: number): Promise<EntradaProduccion> {
    const entradaProduccion = await this.findOne(id, id_empresa);
    const oldUnidades = entradaProduccion.unidades;
    const oldTipoHuevoId = entradaProduccion.tipoHuevoId;

    // Validar galpón si se está actualizando
    if (updateEntradaProduccionDto.galponId) {
      const galpon = await this.galponesRepository.findOne({ where: { id: updateEntradaProduccionDto.galponId } });
      if (!galpon) {
        throw new NotFoundException(`Galpón con ID ${updateEntradaProduccionDto.galponId} no encontrado`);
      }
    }

    // Validar tipo de huevo si se está actualizando
    if (updateEntradaProduccionDto.tipoHuevoId) {
      const tipoHuevo = await this.tiposHuevoRepository.findOne({ where: { id: updateEntradaProduccionDto.tipoHuevoId } });
      if (!tipoHuevo) {
        throw new NotFoundException(`Tipo de huevo con ID ${updateEntradaProduccionDto.tipoHuevoId} no encontrado`);
      }
    }

    if (updateEntradaProduccionDto.galponId === '') {
      updateEntradaProduccionDto.galponId = undefined; // Let it be null via entity definition if needed, or set to null
      entradaProduccion.galponId = null;
    }

    Object.assign(entradaProduccion, updateEntradaProduccionDto);
    const updatedEntrada = await this.entradasProduccionRepository.save(entradaProduccion);

    // Actualizar inventario
    if (updateEntradaProduccionDto.unidades !== undefined || updateEntradaProduccionDto.tipoHuevoId !== undefined) {
      if (oldTipoHuevoId === updatedEntrada.tipoHuevoId) {
        const diferencia = updatedEntrada.unidades - oldUnidades;
        if (diferencia !== 0) {
          await this.inventarioStockService.actualizarInventario(
            updatedEntrada.tipoHuevoId,
            diferencia,
            id_empresa
          );
        }
      } else {
        // Si cambió el tipo de huevo, revertir el anterior y agregar el nuevo
        await this.inventarioStockService.actualizarInventario(
          oldTipoHuevoId,
          -oldUnidades,
          id_empresa
        );
        await this.inventarioStockService.actualizarInventario(
          updatedEntrada.tipoHuevoId,
          updatedEntrada.unidades,
          id_empresa
        );
      }
    }

    return updatedEntrada;
  }

  async remove(id: string, id_empresa: number): Promise<void> {
    const entradaProduccion = await this.findOne(id, id_empresa);

    // Antes de eliminar, descontar del inventario
    await this.inventarioStockService.actualizarInventario(
      entradaProduccion.tipoHuevoId,
      -entradaProduccion.unidades,
      id_empresa
    );

    await this.entradasProduccionRepository.remove(entradaProduccion);
  }

  async getProduccionDiaria(fechaInicio: string, fechaFin: string, id_empresa?: number): Promise<any[]> {
    const queryBuilder = this.entradasProduccionRepository
      .createQueryBuilder('entrada')
      .leftJoin('entrada.tipoHuevo', 'tipoHuevo')
      .select('DATE(entrada.fecha)', 'fecha')
      .addSelect('SUM(entrada.unidades)', 'total')
      .where('entrada.fecha BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin });

    if (id_empresa) {
      queryBuilder.andWhere('entrada.id_empresa = :id_empresa', { id_empresa });
      queryBuilder.andWhere('tipoHuevo.id_empresa = :id_empresa', { id_empresa });
    }

    const result = await queryBuilder
      .groupBy('DATE(entrada.fecha)')
      .orderBy('fecha', 'ASC')
      .getRawMany();

    return result;
  }
}