import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IdEmpresa = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    
    // Obtener id_empresa del usuario autenticado
    // Ajusta según tu sistema de autenticación
    const id_empresa = request.user?.id_empresa;
    
    if (!id_empresa) {
      throw new Error('No se pudo determinar la empresa del usuario');
    }
    
    return id_empresa;
  },
);

// Decorator alternativo si usas headers
export const IdEmpresaHeader = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();
    const idEmpresaRaw =
      request.headers['x-empresa-id'] ||
      request.query.id_empresa ||
      request.body?.id_empresa ||
      request.user?.idEmpresa ||
      request.user?.id_empresa ||
      '2';

    const idEmpresaNum = parseInt(String(idEmpresaRaw));
    return isNaN(idEmpresaNum) ? 2 : idEmpresaNum;
  },
);