"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
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
                callback(null, true);
            }
            else {
                callback(new Error(`CORS bloqueado para origen: ${origin}`));
            }
        },
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Accept',
            'Cache-Control',
        ],
        credentials: true,
        optionsSuccessStatus: 200,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map