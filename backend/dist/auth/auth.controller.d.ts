import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            nombre: any;
            apellido: any;
            rol: any;
        };
    }>;
    register(createUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        nombre: string;
        apellido: string;
        rol: string;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getProfile(req: any): Promise<{
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
