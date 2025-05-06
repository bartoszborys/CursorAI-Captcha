import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Włącz walidację
  app.useGlobalPipes(new ValidationPipe());

  // Konfiguracja Swagger
  const config = new DocumentBuilder()
    .setTitle('CAPTCHA API')
    .setDescription('API do generowania i weryfikacji CAPTCHA')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
