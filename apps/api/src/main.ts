import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('LinguaFlow API')
    .setDescription('API do aplicativo de aprendizado de idiomas LinguaFlow')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/api/docs',
    apiReference({
      spec: {
        content: document,
      },
    }),
  );

  const port = process.env.API_PORT || 3001;
  await app.listen(port);
  console.log(`API rodando em http://localhost:${port}`);
  console.log(`Documentacao da API disponivel em http://localhost:${port}/api/docs`);
}
bootstrap();
