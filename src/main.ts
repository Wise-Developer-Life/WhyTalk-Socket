import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const DEFAULT_APP_PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appPort =
    configService.get<number>('SERVER_START_PORT') || DEFAULT_APP_PORT;

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(appPort);
}

bootstrap();
