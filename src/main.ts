import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ApiResponseInterceptor } from './utils/interceptors/api.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // set validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // set swagger
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('API documentation for the e-commerce platform')
    .setVersion('1.0')
    .addBearerAuth() // JWT support
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // set interceptor
  app.useGlobalInterceptors(new ApiResponseInterceptor());

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started at port ${PORT}`);
  });
}
bootstrap();
