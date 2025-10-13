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
    
    console.log('🔍 Headers disponibles:', request.headers);
    console.log('🔍 Buscando x-empresa-id en headers...');
    
    // Buscar en headers, query params o body
    const id_empresa =
      request.headers['x-empresa-id'] ||
      request.query.id_empresa ||
      request.body?.id_empresa ||
      request.user?.id_empresa;
    
    console.log('🔍 id_empresa encontrado:', id_empresa);
    
    if (!id_empresa) {
      console.error('❌ No se encontró id_empresa en ningún lugar');
      throw new Error('No se proporcionó id_empresa');
    }
    
    // Asegurar que se devuelve un número
    const idEmpresaNum = parseInt(id_empresa);
    
    if (isNaN(idEmpresaNum)) {
      console.error('❌ id_empresa no es un número válido:', id_empresa);
      throw new Error('id_empresa debe ser un número válido');
    }
    
    console.log('✅ id_empresa procesado correctamente:', idEmpresaNum);
    return idEmpresaNum;
  },
);