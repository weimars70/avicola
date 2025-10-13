import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common'; 
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm'; 
import { Tercero } from './entities/tercero.entity'; 
import { CreateTerceroDto, UpdateTerceroDto } from './dto/create-tercero.dto'; 
 
@Injectable() 
export class TercerosService { 
  constructor( 
    @InjectRepository(Tercero) 
    private readonly terceroRepository: Repository<Tercero>, 
  ) {} 
 
  async create(idEmpresa: number, createTerceroDto: CreateTerceroDto): Promise<Tercero> { 
    console.log('Service - crear tercero para empresa:', idEmpresa);
    console.log('Service - datos:', createTerceroDto);
    
    try {
      // Verificar duplicados
      const existe = await this.terceroRepository.findOne({ 
        where: { 
          identificacion: createTerceroDto.identificacion,
          idEmpresa: idEmpresa
        } 
      }); 
  
      if (existe) { 
        throw new BadRequestException('Ya existe un tercero con esta identificación en esta empresa'); 
      } 
  
      // Crear el tercero con el id_empresa proporcionado
      const tercero = this.terceroRepository.create({
        ...createTerceroDto,
        idEmpresa: idEmpresa
      }); 
  
      console.log('Service - tercero a guardar:', tercero);
      
      // Usar save() directamente en lugar de SQL personalizado
      // Esto evita problemas con la tabla estratos y maneja correctamente id_empresa
      const savedTercero = await this.terceroRepository.save(tercero);
      
      console.log('Tercero guardado:', savedTercero);
      return savedTercero;
    } catch (error) {
      console.error('Service - error al crear:', error);
      // Si el error está relacionado con la tabla estratos, proporcionar un mensaje más claro
      if (error.message && error.message.includes('estratos')) {
        throw new BadRequestException('Error al guardar el tercero: el estrato se guarda directamente como código sin necesidad de tabla adicional');
      }
      throw error;
    }
  } 
 
  async findAll(idEmpresa: number): Promise<Tercero[]> { 
    return await this.terceroRepository.find({ 
      where: { idEmpresa: idEmpresa }, 
      order: { codigo: 'DESC' } 
    }); 
  } 
 
  async findOne(codigo: number, idEmpresa: number): Promise<Tercero> { 
    const tercero = await this.terceroRepository.findOne({ 
      where: { 
        codigo: codigo,
        idEmpresa: idEmpresa
      } 
    }); 
 
    if (!tercero) { 
      throw new NotFoundException(`Tercero con código ${codigo} no encontrado`); 
    } 
 
    return tercero; 
  } 

  async update(codigo: number, updateTerceroDto: UpdateTerceroDto, idEmpresa: number): Promise<Tercero> { 
    // Verificar que el tercero exista
    const tercero = await this.findOne(codigo, idEmpresa); 
 
    // Si cambió la identificación, verificar que no exista
    if (updateTerceroDto.identificacion !== tercero.identificacion) { 
      const existe = await this.terceroRepository.findOne({ 
        where: { 
          identificacion: updateTerceroDto.identificacion,
          idEmpresa: idEmpresa
        } 
      }); 
 
      if (existe) { 
        throw new BadRequestException('Ya existe un tercero con esta identificación en esta empresa'); 
      } 
    } 
 
    Object.assign(tercero, updateTerceroDto); 
 
    return await this.terceroRepository.save(tercero); 
  } 

  async remove(codigo: number, idEmpresa: number): Promise<void> { 
    const tercero = await this.findOne(codigo, idEmpresa); 
    await this.terceroRepository.remove(tercero); 
  } 
 
  async buscarPorIdentificacion(identificacion: string, idEmpresa: number): Promise<Tercero[]> { 
    return await this.terceroRepository 
      .createQueryBuilder('tercero') 
      .where('tercero.identificacion LIKE :identificacion AND tercero.id_empresa = :idEmpresa', { 
        identificacion: `%${identificacion}%`,
        idEmpresa: idEmpresa
      }) 
      .getMany(); 
  } 

  async buscarPorNombre(nombre: string, idEmpresa: number): Promise<Tercero[]> { 
    return await this.terceroRepository 
      .createQueryBuilder('tercero') 
      .where('tercero.nombre LIKE :nombre AND tercero.id_empresa = :idEmpresa', { 
        nombre: `%${nombre}%`,
        idEmpresa: idEmpresa
      }) 
      .getMany(); 
  } 

  async findActivos(idEmpresa: number): Promise<Tercero[]> { 
    return await this.terceroRepository.find({ 
      where: { 
        activo: true,
        idEmpresa: idEmpresa
      }, 
      order: { nombre: 'ASC' } 
    }); 
  } 
 
  async findClientes(idEmpresa: number): Promise<Tercero[]> {
    return await this.terceroRepository.find({
      where: {
        cliente: true,
        activo: true,
        idEmpresa: idEmpresa
      },
      order: { nombre: 'ASC' }
    });
  }

  async findProveedores(idEmpresa: number): Promise<Tercero[]> {
    return await this.terceroRepository.find({
      where: {
        proveedor: true,
        activo: true,
        idEmpresa: idEmpresa
      },
      order: { nombre: 'ASC' }
    });
  }
}