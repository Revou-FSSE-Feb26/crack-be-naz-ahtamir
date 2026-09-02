import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ── Global Validation Pipe ──
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ── CORS ──
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Disposition'],
  });

  // ── Static Files (for uploaded files) ──
  // Gunakan process.cwd() agar path benar di semua mode (dev/prod/watch)
  const uploadsPath = join(process.cwd(), 'public', 'uploads');
  app.use('/uploads', (req: any, res: any, next: any) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  });
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
  });

  // ── Swagger Documentation ──
  const config = new DocumentBuilder()
    .setTitle('SMK3 Enterprise API')
    .setDescription('API untuk sistem manajemen K3 PT. QMB New Energy Materials')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // ── Start Server ──
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();