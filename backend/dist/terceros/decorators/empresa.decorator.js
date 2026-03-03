"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdEmpresaHeader = exports.IdEmpresa = void 0;
const common_1 = require("@nestjs/common");
exports.IdEmpresa = (0, common_1.createParamDecorator)((data, ctx) => {
    var _a, _b;
    const request = ctx.switchToHttp().getRequest();
    const id_empresa = ((_a = request.user) === null || _a === void 0 ? void 0 : _a.id_empresa) || ((_b = request.user) === null || _b === void 0 ? void 0 : _b.idEmpresa);
    if (!id_empresa) {
        throw new common_1.UnauthorizedException('No se pudo determinar la empresa del usuario. Token inválido o sin contexto de empresa.');
    }
    return Number(id_empresa);
});
exports.IdEmpresaHeader = exports.IdEmpresa;
//# sourceMappingURL=empresa.decorator.js.map