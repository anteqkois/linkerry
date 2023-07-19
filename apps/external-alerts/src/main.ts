import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@market-connector/core'

const globalPrefix = 'api';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT_EXTERNAL_ALERTS || 3002;

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
  Logger.log(
    `🚀 External Alerts service is running on: http://localhost:${ port }/${ globalPrefix }`
  );
}
bootstrap();
