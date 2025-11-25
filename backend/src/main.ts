import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

// Filtro global de excepciones para diagnóstico
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.error('🔥 Excepción global atrapada:', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    
    console.log('📍 Request que causó el error:', {
      method: request.method,
      url: request.url,
      body: request.body,
      query: request.query,
      headers: request.headers
    });
    
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    response.status(status).json({ 
      error: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url 
    });
  }
}

async function bootstrap() {
  console.log('🚀 1. Iniciando aplicación NestJS...');
  
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  
  console.log('✅ 2. Aplicación NestJS creada exitosamente');
  
  // Middleware global para loggear todas las requests
  app.use((req, res, next) => {
    console.log(`📥 3. REQUEST RECIBIDO: ${req.method} ${req.url}`);
    console.log('📋 Headers:', req.headers);
    console.log('🔍 Query:', req.query);
    console.log('📦 Body:', req.body);
    next();
  });
  
  console.log('✅ 4. Middleware de logging configurado');
  
  // Añadir filtro global de excepciones para diagnóstico
  app.useGlobalFilters(new GlobalExceptionFilter());
  console.log('✅ 5. Filtro global de excepciones configurado');
  
  // Configurar CORS
  console.log('🔧 6. Configurando CORS...');
 app.enableCors({
    origin: (origin, callback) => {
      console.log(`🌐 CORS: Verificando origen: ${origin}`);
      // Permitir requests sin 'origin' (ej: desde apps móviles nativas con Capacitor)
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
        'capacitor://',   // 👈 agregar este
        null ,             // 👈 permitir requests sin origin
        'https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--5173--4d9fd228.local-credentialless.webcontainer-api.io/',
      ];

      if (allowedOrigins.includes(origin)) {
        console.log('✅ CORS: Origen permitido');
        callback(null, true);
      } else {
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
  
  // Configurar validación global
  console.log('🔧 8. Configurando ValidationPipe...');
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  console.log('✅ 9. ValidationPipe configurado');
  
  const port = process.env.PORT || 3012;
  console.log(`🔧 10. Iniciando servidor en puerto ${port}...`);
  
  await app.listen(port);
  console.log(`🎉 11. Servidor ejecutándose exitosamente en http://localhost:${port}`);
  console.log('🔍 12. Esperando requests...');
}

console.log('🏁 0. Ejecutando bootstrap...');
bootstrap().catch(err => {
  console.error('💥 Error fatal en bootstrap:', err);
});