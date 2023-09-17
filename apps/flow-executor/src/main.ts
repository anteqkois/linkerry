import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { AppModule } from './app/app.module'

const PORT = +process.env.PORT || 3005

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: "127.0.0.1",
      port: PORT,
    },
  })

  await app.listen()
  Logger.log(`🚀 Application is running on: http://localhost:${PORT}`)
}

bootstrap()
