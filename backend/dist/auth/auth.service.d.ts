import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            nombre: any;
            apellido: any;
            rol: any;
            id_empresa: any;
        };
    }>;
    register(createUserDto: any): Promise<{
        id: string;
        email: string;
        nombre: string;
        apellido: string;
        rol: string;
        activo: boolean;
        id_empresa: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getProfile(userId: string): Promise<{
        id_empresa: number;
        id: string;
        email: string;
        nombre: string;
        apellido: string;
        rol: string;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
