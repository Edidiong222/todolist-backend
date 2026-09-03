import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import * as cookieParser from 'cookie-parser'
import cookieParser =  require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:"*"
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted:true,
    }),
  );
  app.use(cookieParser())
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT ?? 5000);
  return 'Hello world'
}
bootstrap();
