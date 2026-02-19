import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const IdEmpresa = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest();

    // STRICT: Only trust the authenticated user's company ID
    const id_empresa = request.user?.id_empresa || request.user?.idEmpresa;

    if (!id_empresa) {
      throw new UnauthorizedException('No se pudo determinar la empresa del usuario. Token inválido o sin contexto de empresa.');
    }

    return Number(id_empresa);
  },
);

// Deprecated: Alias to IdEmpresa to force migration to secure behavior
// We keep the name but change behavior to be identical to IdEmpresa for backward compatibility in code, 
// but securely ignoring headers.
export const IdEmpresaHeader = IdEmpresa;