import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

// 📚 참고: https://docs.nestjs.com/first-steps

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');

  // Global Validation Pipe
  // 📚 참고: https://docs.nestjs.com/techniques/validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  // CORS
  // 📚 참고: https://docs.nestjs.com/security/cors
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', '*'),
    credentials: true,
  });

  // API Prefix
  app.setGlobalPrefix('api');

  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  if (nodeEnv === 'development') {
    console.log(`📊 GraphQL Playground: http://localhost:${port}/api/graphql`);
  }
}

bootstrap();
