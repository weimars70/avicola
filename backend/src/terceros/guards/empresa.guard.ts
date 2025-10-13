import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class EmpresaGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    
    const id_empresa =
      request.user?.id_empresa ||
      request.headers['x-empresa-id'] ||
      request.query.id_empresa;

    if (!id_empresa) {
      throw new ForbiddenException('No se proporcionó información de empresa');
    }

    // Agregar al request para uso posterior
    request.id_empresa = parseInt(id_empresa);
    
    return true;
  }
}