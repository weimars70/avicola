import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log(`👤 Intentando crear usuario: ${createUserDto.email}`);
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      console.warn(`⚠️ Email ya existe: ${createUserDto.email} `);
      throw new ConflictException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    let id_empresa = createUserDto.id_empresa;

    // Si no se proporciona id_empresa (registro público), generamos uno nuevo
    if (!id_empresa) {
      console.log('🏢 Generando id_empresa automático para registro nuevo...');
      const result = await this.userRepository
        .createQueryBuilder('user')
        .select('MAX(user.id_empresa)', 'max')
        .getRawOne();

      const maxId = result?.max || 0;
      id_empresa = maxId + 1;
      console.log(`🆕 Nuevo id_empresa asignado: ${id_empresa} `);
    }

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      id_empresa,
    });

    const savedUser = await this.userRepository.save(user);
    console.log(`✅ Usuario creado exitosamente: ${savedUser.email} (empresa: ${savedUser.id_empresa})`);
    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'email', 'nombre', 'apellido', 'rol', 'activo', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'email', 'nombre', 'apellido', 'rol', 'activo', 'createdAt', 'updatedAt', 'id_empresa'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}