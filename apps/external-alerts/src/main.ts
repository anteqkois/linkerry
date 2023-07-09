import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

const globalPrefix = 'api';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3001;

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
  }));

  await app.listen(port);
  Logger.log(
    `🚀 External Alerts service is running on: http://localhost:${ port }/${ globalPrefix }`
  );
}
bootstrap();
