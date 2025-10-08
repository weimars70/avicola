import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AjusteInventario } from './entities/ajuste-inventario.entity';
import { AjusteLote } from './entities/ajuste-lote.entity';
import { CreateAjusteInventarioDto } from './dto/create-ajuste-inventario.dto';
import { CreateAjusteLoteDto } from './dto/create-ajuste-lote.dto';
import { UpdateAjusteLoteDto } from './dto/update-ajuste-lote.dto';
import { InventarioStockService } from './inventario-stock.service';
import { TiposHuevoService } from '../tipos-huevo/tipos-huevo.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class AjustesInventarioService {
  constructor(
    @InjectRepository(AjusteInventario)
    private ajustesRepository: Repository<AjusteInventario>,
    @InjectRepository(AjusteLote)
    private ajustesLoteRepository: Repository<AjusteLote>,
    private inventarioStockService: InventarioStockService,
    private tiposHuevoService: TiposHuevoService,
    private usersService: UsersService,
  ) {}

  async create(createAjusteDto: CreateAjusteInventarioDto, id_empresa: number = 1): Promise<AjusteInventario> {
    // Validar que el tipo de huevo existe
    const tipoHuevo = await this.tiposHuevoService.findOne(createAjusteDto.tipoHuevoId);
    if (!tipoHuevo) {
      throw new NotFoundException(`Tipo de huevo con ID ${createAjusteDto.tipoHuevoId} no encontrado`);
    }

    // Validar que el usuario existe
    const usuario = await this.usersService.findOne(createAjusteDto.usuarioId);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${createAjusteDto.usuarioId} no encontrado`);
    }

    // Obtener inventario actual
    const inventarioActual = await this.inventarioStockService.findByTipoHuevo(createAjusteDto.tipoHuevoId, id_empresa);
    const cantidadAnterior = inventarioActual ? inventarioActual.unidades : 0;

    // Validar que no se puede restar más de lo que hay en stock
    if (createAjusteDto.tipoAjuste === 'resta' && cantidadAnterior < createAjusteDto.cantidadAjuste) {
      throw new BadRequestException(
        `No se puede restar ${createAjusteDto.cantidadAjuste} unidades. Stock actual: ${cantidadAnterior}`
      );
    }

    // Calcular nueva cantidad
    let cantidadNueva: number;
    if (createAjusteDto.tipoAjuste === 'suma') {
      cantidadNueva = cantidadAnterior + createAjusteDto.cantidadAjuste;
    } else {
      cantidadNueva = cantidadAnterior - createAjusteDto.cantidadAjuste;
    }

    // Crear el registro de ajuste
    const ajuste = this.ajustesRepository.create({
      ...createAjusteDto,
      cantidadAnterior,
      cantidadNueva,
    });

    const savedAjuste = await this.ajustesRepository.save(ajuste);

    // Actualizar el inventario
    if (createAjusteDto.tipoAjuste === 'suma') {
      await this.inventarioStockService.aumentarStock(
        createAjusteDto.tipoHuevoId,
        createAjusteDto.cantidadAjuste
      );
    } else {
      await this.inventarioStockService.reducirStock(
        createAjusteDto.tipoHuevoId,
        createAjusteDto.cantidadAjuste
      );
    }

    return savedAjuste;
  }

  async findAll(id_empresa: number): Promise<AjusteInventario[]> {
    return await this.ajustesRepository.find({
      relations: ['tipoHuevo', 'usuario'],
      where: { tipoHuevo: { id_empresa } },
      order: { createdAt: 'DESC' },
    });
  }

  async findByTipoHuevo(tipoHuevoId: string, id_empresa: number): Promise<AjusteInventario[]> {
    return await this.ajustesRepository.find({
      where: { tipoHuevoId, tipoHuevo: { id_empresa } },
      relations: ['tipoHuevo', 'usuario'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<AjusteInventario> {
    const ajuste = await this.ajustesRepository.findOne({
      where: { id },
      relations: ['tipoHuevo', 'usuario'],
    });

    if (!ajuste) {
      throw new NotFoundException(`Ajuste de inventario con ID ${id} no encontrado`);
    }

    return ajuste;
  }

  async createLote(createAjusteLoteDto: CreateAjusteLoteDto, id_empresa: number): Promise<AjusteLote> {
    // Validar que el usuario existe
    const usuario = await this.usersService.findOne(createAjusteLoteDto.usuarioId);
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${createAjusteLoteDto.usuarioId} no encontrado`);
    }

    // Crear el lote de ajustes
    const ajusteLote = this.ajustesLoteRepository.create({
      descripcionGeneral: createAjusteLoteDto.descripcionGeneral,
      usuarioId: createAjusteLoteDto.usuarioId,
      id_empresa: createAjusteLoteDto.id_empresa || id_empresa,
      id_usuario_inserta: createAjusteLoteDto.id_usuario_inserta || createAjusteLoteDto.usuarioId,
    });

    const savedLote = await this.ajustesLoteRepository.save(ajusteLote);

    // Procesar cada ajuste individual
    const ajustesCreados = [];
    for (const ajusteItem of createAjusteLoteDto.ajustes) {
      // Validar que el tipo de huevo existe
      const tipoHuevo = await this.tiposHuevoService.findOne(ajusteItem.tipoHuevoId);
      if (!tipoHuevo) {
        throw new NotFoundException(`Tipo de huevo con ID ${ajusteItem.tipoHuevoId} no encontrado`);
      }

      // Obtener inventario actual
      const inventarioActual = await this.inventarioStockService.findByTipoHuevo(ajusteItem.tipoHuevoId, id_empresa);
      const cantidadAnterior = inventarioActual ? inventarioActual.unidades : 0;

      // Validar que no se puede restar más de lo que hay en stock
      if (ajusteItem.tipoAjuste === 'resta' && cantidadAnterior < ajusteItem.cantidadAjuste) {
        throw new BadRequestException(
          `No se puede restar ${ajusteItem.cantidadAjuste} unidades de ${tipoHuevo.nombre}. Stock actual: ${cantidadAnterior}`
        );
      }

      // Calcular nueva cantidad
      let cantidadNueva: number;
      if (ajusteItem.tipoAjuste === 'suma') {
        cantidadNueva = cantidadAnterior + ajusteItem.cantidadAjuste;
      } else {
        cantidadNueva = cantidadAnterior - ajusteItem.cantidadAjuste;
      }

      // Crear el registro de ajuste individual
      const ajuste = this.ajustesRepository.create({
        tipoHuevoId: ajusteItem.tipoHuevoId,
        cantidadAjuste: ajusteItem.cantidadAjuste,
        tipoAjuste: ajusteItem.tipoAjuste,
        descripcion: ajusteItem.descripcion || createAjusteLoteDto.descripcionGeneral,
        usuarioId: createAjusteLoteDto.usuarioId,
        ajusteLoteId: savedLote.id,
        cantidadAnterior,
        cantidadNueva,
        id_empresa: createAjusteLoteDto.id_empresa || id_empresa,
        id_usuario_inserta: createAjusteLoteDto.id_usuario_inserta || createAjusteLoteDto.usuarioId,
      });

      const savedAjuste = await this.ajustesRepository.save(ajuste);
      ajustesCreados.push(savedAjuste);

      // Actualizar el inventario
      if (ajusteItem.tipoAjuste === 'suma') {
        await this.inventarioStockService.aumentarStock(
          ajusteItem.tipoHuevoId,
          ajusteItem.cantidadAjuste,
          id_empresa
        );
      } else {
        await this.inventarioStockService.reducirStock(
          ajusteItem.tipoHuevoId,
          ajusteItem.cantidadAjuste,
          id_empresa
        );
      }
    }

    // Retornar el lote con los ajustes creados
    return await this.ajustesLoteRepository.findOne({
      where: { id: savedLote.id },
      relations: ['usuario', 'ajustes', 'ajustes.tipoHuevo'],
    });
  }

  async findAllLotes(id_empresa: number): Promise<AjusteLote[]> {
    return await this.ajustesLoteRepository.find({
      relations: ['usuario', 'ajustes', 'ajustes.tipoHuevo'],
      where: { ajustes: { tipoHuevo: { id_empresa } } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneLote(id: string): Promise<AjusteLote> {
    const lote = await this.ajustesLoteRepository.findOne({
      where: { id },
      relations: ['usuario', 'ajustes', 'ajustes.tipoHuevo'],
    });

    if (!lote) {
      throw new NotFoundException(`Lote de ajustes con ID ${id} no encontrado`);
    }

    return lote;
  }

  async updateLote(id: string, updateAjusteLoteDto: UpdateAjusteLoteDto): Promise<AjusteLote> {
    const lote = await this.findOneLote(id);
    
    // Actualizar solo la descripción general
    if (updateAjusteLoteDto.descripcionGeneral) {
      lote.descripcionGeneral = updateAjusteLoteDto.descripcionGeneral;
    }
    
    await this.ajustesLoteRepository.save(lote);
    return await this.findOneLote(id);
  }

  async removeLote(id: string): Promise<void> {
    const lote = await this.findOneLote(id);
    
    // Primero revertir todos los ajustes de inventario
    if (lote.ajustes && lote.ajustes.length > 0) {
      for (const ajuste of lote.ajustes) {
        // Revertir el ajuste en el inventario
        if (ajuste.tipoAjuste === 'suma') {
          await this.inventarioStockService.reducirStock(
            ajuste.tipoHuevoId,
            ajuste.cantidadAjuste
          );
        } else {
          await this.inventarioStockService.aumentarStock(
            ajuste.tipoHuevoId,
            ajuste.cantidadAjuste
          );
        }
      }
      
      // Luego eliminar todos los ajustes asociados
      await this.ajustesRepository.remove(lote.ajustes);
    }
    
    // Finalmente eliminar el lote
    await this.ajustesLoteRepository.remove(lote);
  }

  async update(id: string, updateAjusteDto: CreateAjusteInventarioDto): Promise<AjusteInventario> {
    const ajuste = await this.findOne(id);
    
    // Revertir el ajuste anterior en el inventario
    if (ajuste.tipoAjuste === 'suma') {
      await this.inventarioStockService.reducirStock(
        ajuste.tipoHuevoId,
        ajuste.cantidadAjuste
      );
    } else {
      await this.inventarioStockService.aumentarStock(
        ajuste.tipoHuevoId,
        ajuste.cantidadAjuste
      );
    }
    
    // Obtener la cantidad actual del inventario
    const inventarioActual = await this.inventarioStockService.findByTipoHuevo(updateAjusteDto.tipoHuevoId, 1);
    const cantidadAnterior = inventarioActual ? inventarioActual.unidades : 0;
    
    let cantidadNueva: number;
    if (updateAjusteDto.tipoAjuste === 'suma') {
      cantidadNueva = cantidadAnterior + updateAjusteDto.cantidadAjuste;
    } else {
      cantidadNueva = cantidadAnterior - updateAjusteDto.cantidadAjuste;
      if (cantidadNueva < 0) {
        throw new BadRequestException('No hay suficiente stock para realizar este ajuste');
      }
    }
    
    // Actualizar el ajuste
    Object.assign(ajuste, {
      ...updateAjusteDto,
      cantidadAnterior,
      cantidadNueva,
    });
    
    const savedAjuste = await this.ajustesRepository.save(ajuste);
    
    // Aplicar el nuevo ajuste al inventario
    if (updateAjusteDto.tipoAjuste === 'suma') {
      await this.inventarioStockService.aumentarStock(
        updateAjusteDto.tipoHuevoId,
        updateAjusteDto.cantidadAjuste
      );
    } else {
      await this.inventarioStockService.reducirStock(
        updateAjusteDto.tipoHuevoId,
        updateAjusteDto.cantidadAjuste
      );
    }
    
    return await this.findOne(savedAjuste.id);
  }

  async remove(id: string): Promise<void> {
    const ajuste = await this.findOne(id);
    
    // Revertir el ajuste en el inventario
    if (ajuste.tipoAjuste === 'suma') {
      await this.inventarioStockService.reducirStock(
        ajuste.tipoHuevoId,
        ajuste.cantidadAjuste
      );
    } else {
      await this.inventarioStockService.aumentarStock(
        ajuste.tipoHuevoId,
        ajuste.cantidadAjuste
      );
    }
    
    await this.ajustesRepository.remove(ajuste);
  }
}