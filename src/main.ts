import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { BigIntSerializerInterceptor } from './common/interceptors/bigint-serializer.interceptor';
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';
import { ApiExceptionFilter } from './common/filters/api-exception.filter';


async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);
 
  
  // Habilitar validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Global interceptors: serialize BigInt first, then wrap responses
  app.useGlobalInterceptors(
    new BigIntSerializerInterceptor(),
    new ApiResponseInterceptor(),
  );

  // Global error filter to standardize error responses
  app.useGlobalFilters(new ApiExceptionFilter());
    // Enable CORS so the frontend (Vite at :5173) can call this API during development.
    // Configure allowed origin via FRONTEND_ORIGIN env var, fallback to localhost:5173.
const envOrigin = process.env.FRONTEND_ORIGIN;
const allowedOrigins = [
  envOrigin,                   // Valor configurado por ambiente
  'http://localhost:3000',     // Swagger local (mismo puerto)
  'http://localhost:3001',     // Swagger local (mismo puerto)
  'http://127.0.0.1:3000',
  'http://localhost:5173',     // Frontend local
  'http://127.0.0.1:5173',
  'https://cysmark.com',
  'https://www.cysmark.com'
].filter(Boolean);

const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    // Si no hay origin (ej. Postman) o está en la lista, permitir
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS no permitido para: ${origin}`));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
};

app.enableCors(corsOptions);


  // Prefijo global para las rutas
  app.setGlobalPrefix('api');
  
  // Solo habilitar Swagger en localhost/desarrollo
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('API PsFirm')
      .setDescription('API documentation')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
