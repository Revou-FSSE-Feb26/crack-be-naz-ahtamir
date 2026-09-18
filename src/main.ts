import { NestFactory, Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ── Global Validation Pipe ──
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ── CORS — origin dari env var ──
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : ['http://localhost:3000', 'http://127.0.0.1:3000'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Disposition'],
  });

  // ── Static Files (uploaded files) ──
  const uploadsPath = join(process.cwd(), 'public', 'uploads');
  app.use('/uploads', (req: any, res: any, next: any) => {
    const origin = req.headers.origin;
    if (!origin || allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin || allowedOrigins[0]);
    }
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  });
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  // ── Swagger — hanya aktif di luar production ──
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('SMK3 Enterprise API')
      .setDescription('API untuk sistem manajemen K3 PT. QMB New Energy Materials')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    logger.log('📚 Swagger docs: http://localhost:3001/api/docs');
  }

  // ── Start Server ──
  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`🚀 Backend running on http://localhost:${port}`);
}

bootstrap();
