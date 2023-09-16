import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app/app.module'

const globalPrefix = 'api'
const port = process.env.PORT || 3004

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix(globalPrefix)
  await app.listen(port)
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`)
}

bootstrap()
