import { IsEmail, IsString, MinLength, IsOptional, IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  rol?: string;

  @IsOptional()
  activo?: boolean;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  id_empresa: number;
}