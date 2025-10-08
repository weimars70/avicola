import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  
  // Configurar CORS
 app.enableCors({
    origin: (origin, callback) => {
      // Permitir requests sin 'origin' (ej: desde apps móviles nativas con Capacitor)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        'https://bolt.new',
        'http://localhost:3011',
        'http://localhost',
        'http://2.58.80.90:3011',
        'http://2.58.80.90:3012',
        'http://2.58.80.90',
        'capacitor://localhost',
        'capacitor://2.58.80.90',
        'capacitor://',   // 👈 agregar este
        null ,             // 👈 permitir requests sin origin
        'https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--5173--4d9fd228.local-credentialless.webcontainer-api.io/',
      ];

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
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
  
  // Configurar validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
}
bootstrap();