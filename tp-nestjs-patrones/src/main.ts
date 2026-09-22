

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  // 1) Creamos la aplicación Nest a partir del módulo raíz.
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades que no están en el DTO
      forbidNonWhitelisted: true, // si mandan una propiedad de más, tira error
      transform: true, // convierte tipos automáticamente (ej: string -> number)
    }),
  );
  app.enableCors();

  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);

  console.log(`🚀 Aplicación corriendo en: http://localhost:${PORT}`);
}

bootstrap();
