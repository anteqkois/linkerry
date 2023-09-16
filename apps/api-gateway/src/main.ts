import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app/app.module'

const globalPrefix = 'api'
const PORT = process.env.PORT || 3004

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix(globalPrefix)
  await app.listen(PORT)
  Logger.log(`🚀 Application is running on: http://localhost:${PORT}/${globalPrefix}`)
}

bootstrap()
