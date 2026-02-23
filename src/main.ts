import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

process.on('uncaughtException', (err) => {
  console.error('uncaughtException:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('unhandledRejection:', reason);
  process.exit(1);
});

async function bootstrap() {
  console.log('Bootstrap starting, PORT=', process.env.PORT);
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONT_URL ?? 'http://localhost:3000',
    credentials: true,
  })

  app.use(cookieParser())

  // Static uploads (локальные загруженные файлы)
  const uploadsRoot = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsRoot)) mkdirSync(uploadsRoot, { recursive: true });
  app.use('/uploads', express.static(uploadsRoot));

  app.useGlobalPipes(
    new ValidationPipe(
      {
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      }
    )
  )
  const port = process.env.PORT ?? 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`Server listening on http://0.0.0.0:${port}`);
}
bootstrap().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
