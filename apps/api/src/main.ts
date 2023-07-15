import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app/app.module';

const globalPrefix = 'api';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT_API || 3001;

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    enableDebugMessages: true,
  }));

  await app.listen(port);
  Logger.log(
    `🚀 Api service is running on: http://localhost:${ port }/${ globalPrefix }`
  );
}
bootstrap();
