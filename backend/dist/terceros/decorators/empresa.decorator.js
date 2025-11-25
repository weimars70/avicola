"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdEmpresaHeader = exports.IdEmpresa = void 0;
const common_1 = require("@nestjs/common");
exports.IdEmpresa = (0, common_1.createParamDecorator)((data, ctx) => {
    var _a;
    const request = ctx.switchToHttp().getRequest();
    const id_empresa = (_a = request.user) === null || _a === void 0 ? void 0 : _a.id_empresa;
    if (!id_empresa) {
        throw new Error('No se pudo determinar la empresa del usuario');
    }
    return id_empresa;
});
exports.IdEmpresaHeader = (0, common_1.createParamDecorator)((data, ctx) => {
    var _a, _b, _c;
    const request = ctx.switchToHttp().getRequest();
    const idEmpresaRaw = request.headers['x-empresa-id'] ||
        request.query.id_empresa ||
        ((_a = request.body) === null || _a === void 0 ? void 0 : _a.id_empresa) ||
        ((_b = request.user) === null || _b === void 0 ? void 0 : _b.idEmpresa) ||
        ((_c = request.user) === null || _c === void 0 ? void 0 : _c.id_empresa) ||
        '2';
    const idEmpresaNum = parseInt(String(idEmpresaRaw));
    return isNaN(idEmpresaNum) ? 2 : idEmpresaNum;
});
//# sourceMappingURL=empresa.decorator.js.map