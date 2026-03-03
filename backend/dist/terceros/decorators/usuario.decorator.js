"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdUsuario = void 0;
const common_1 = require("@nestjs/common");
exports.IdUsuario = (0, common_1.createParamDecorator)((data, ctx) => {
    var _a;
    const request = ctx.switchToHttp().getRequest();
    const id_usuario = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!id_usuario) {
        throw new common_1.UnauthorizedException('No se pudo determinar el usuario. Token inválido o sin contexto de usuario.');
    }
    return id_usuario;
});
//# sourceMappingURL=usuario.decorator.js.map