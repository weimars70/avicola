import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class EmpresaMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // El usuario ya debe estar autenticado por JwtAuthGuard
    // y el objeto user debe estar disponible en req
    if (req.user && 'id_empresa' in req.user) {
      // Extraer id_empresa del objeto user (que viene del token JWT)
      req['id_empresa'] = req.user['id_empresa'];
      console.log('🔍 ID Empresa desde token:', req.user['id_empresa']);
    } else {
      // Si no hay id_empresa en el token, intentar obtenerlo de los query params
      const id_empresa = req.query.id_empresa;
      if (id_empresa) {
        req['id_empresa'] = id_empresa;
        console.log('🔍 ID Empresa desde query params:', id_empresa);
      } else {
        console.warn('⚠️ No se encontró id_empresa en el token ni en los query params');
      }
    }
    
    next();
  }
}