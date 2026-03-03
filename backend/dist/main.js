"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalExceptionFilter = void 0;
const core_1 = require("@nestjs/core");
process.env.TZ = 'America/Bogota';
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let GlobalExceptionFilter = class GlobalExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception instanceof common_1.HttpException ? exception.getStatus() : 500;
        let message = exception.message;
        if (exception.response) {
            if (typeof exception.response === 'object') {
                message = exception.response.message || exception.message;
            }
            else {
                message = exception.response;
            }
        }
        const errorLog = {
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            body: request.body,
            query: request.query,
            exception: {
                name: exception.name,
                message: message,
                rawResponse: exception.response,
                stack: exception.stack
            }
        };
        const logMessage = `\n--- ERROR [${errorLog.timestamp}] ---\n${JSON.stringify(errorLog, null, 2)}\n`;
        try {
            const logFilePath = path.join(process.cwd(), 'debug_api.log');
            fs.appendFileSync(logFilePath, logMessage);
        }
        catch (err) {
            console.error('No se pudo escribir en debug_api.log:', err);
        }
        console.error('🔥 [FILTER] Excepción caught:', message);
        response.status(status).json({
            statusCode: status,
            error: exception.name || 'Error',
            message: message,
            timestamp: errorLog.timestamp,
            path: request.url
        });
    }
};
exports.GlobalExceptionFilter = GlobalExceptionFilter;
exports.GlobalExceptionFilter = GlobalExceptionFilter = __decorate([
    (0, common_1.Catch)()
], GlobalExceptionFilter);
async function bootstrap() {
    console.log('🚀 1. Iniciando aplicación NestJS...');
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    console.log('✅ 2. Aplicación NestJS creada exitosamente');
    app.use((req, res, next) => {
        const logInfo = {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.url,
            query: req.query,
            body: req.body,
            headers: {
                'content-type': req.headers['content-type'],
                'authorization': req.headers['authorization'] ? 'Present' : 'Absent',
                'x-empresa-id': req.headers['x-empresa-id']
            }
        };
        const logMessage = `\n>>> REQUEST [${logInfo.timestamp}] ${logInfo.method} ${logInfo.url}\n${JSON.stringify(logInfo, null, 2)}\n`;
        try {
            const logFilePath = path.join(process.cwd(), 'debug_api.log');
            fs.appendFileSync(logFilePath, logMessage);
        }
        catch (err) {
        }
        console.log(`📥 [REQ] ${req.method} ${req.url}`);
        next();
    });
    console.log('✅ 4. Middleware de logging configurado');
    app.useGlobalFilters(new GlobalExceptionFilter());
    console.log('✅ 5. Filtro global de excepciones configurado');
    console.log('🔧 6. Configurando CORS...');
    app.enableCors({
        origin: (origin, callback) => {
            console.log(`🌐 CORS: Verificando origen: ${origin}`);
            if (!origin) {
                console.log('✅ CORS: Permitiendo request sin origen');
                return callback(null, true);
            }
            const allowedOrigins = [
                'https://bolt.new',
                'http://localhost:3011',
                'http://localhost',
                'http://2.58.80.90:3011',
                'http://2.58.80.90:3012',
                'http://2.58.80.90',
                'capacitor://localhost',
                'capacitor://2.58.80.90',
                'capacitor://',
                null,
                'https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--5173--4d9fd228.local-credentialless.webcontainer-api.io/',
            ];
            if (allowedOrigins.includes(origin)) {
                console.log('✅ CORS: Origen permitido');
                callback(null, true);
            }
            else {
                console.log('❌ CORS: Origen bloqueado');
                callback(new Error(`CORS bloqueado para origen: ${origin}`));
            }
        },
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Accept',
            'Cache-Control',
            'x-empresa-id',
        ],
        credentials: true,
        optionsSuccessStatus: 200,
    });
    console.log('✅ 7. CORS configurado exitosamente');
    console.log('🔧 8. Configurando ValidationPipe...');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: false,
        transform: true,
    }));
    console.log('✅ 9. ValidationPipe configurado');
    const port = process.env.PORT || 3012;
    console.log(`🔧 10. Iniciando servidor en puerto ${port} (0.0.0.0)...`);
    try {
        await app.listen(port, '0.0.0.0');
        console.log(`🎉 11. Servidor ejecutándose exitosamente en http://0.0.0.0:${port}`);
        console.log('🔍 12. Esperando requests...');
    }
    catch (error) {
        console.error('💥 ERROR AL INICIAR SERVIDOR:', error);
        process.exit(1);
    }
}
console.log('🏁 0. Ejecutando bootstrap...');
bootstrap().catch(err => {
    console.error('💥 Error fatal en bootstrap:', err);
});
//# sourceMappingURL=main.js.map