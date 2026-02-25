import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

export const IdUsuario = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): string => {
        const request = ctx.switchToHttp().getRequest();

        const id_usuario = request.user?.id;

        if (!id_usuario) {
            throw new UnauthorizedException('No se pudo determinar el usuario. Token inválido o sin contexto de usuario.');
        }

        return id_usuario;
    },
);
