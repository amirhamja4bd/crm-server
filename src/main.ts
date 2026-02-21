import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { HttpExceptionFilter } from '@/shared/filters/http-exception.filter';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true, // allow any origin in development; set to specific origins in production
    credentials: true,
  });

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: false,
  //     transform: true,
  //   }),
  // );
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger setup
  const port = process.env.PORT ?? 3000;
  const config = new DocumentBuilder()
    .setTitle('VAT ERP API')
    .setDescription('This is the VAT ERP API documentation')
    .setVersion('1.0.0')
    .addServer(`http://localhost:${port}`, 'Local')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT Authorization header using the Bearer scheme (e.g. "Bearer {token}")',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
