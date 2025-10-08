"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaMiddleware = void 0;
const common_1 = require("@nestjs/common");
let EmpresaMiddleware = class EmpresaMiddleware {
    use(req, res, next) {
        if (req.user && 'id_empresa' in req.user) {
            req['id_empresa'] = req.user['id_empresa'];
            console.log('🔍 ID Empresa desde token:', req.user['id_empresa']);
        }
        else {
            const id_empresa = req.query.id_empresa;
            if (id_empresa) {
                req['id_empresa'] = id_empresa;
                console.log('🔍 ID Empresa desde query params:', id_empresa);
            }
            else {
                console.warn('⚠️ No se encontró id_empresa en el token ni en los query params');
            }
        }
        next();
    }
};
exports.EmpresaMiddleware = EmpresaMiddleware;
exports.EmpresaMiddleware = EmpresaMiddleware = __decorate([
    (0, common_1.Injectable)()
], EmpresaMiddleware);
//# sourceMappingURL=empresa.middleware.js.map