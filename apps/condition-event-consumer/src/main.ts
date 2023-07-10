import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER_URL],
        },
      },
    },
  );
  await app.listen();
  Logger.log(
    `🚀 Condition Consumer service  is running`
  );
}

bootstrap();
