import { ValidationPipe } from '@market-connector/core'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app/app.module'
import fastifyCookie from '@fastify/cookie'
import { ConfigService } from '@nestjs/config'

const globalPrefix = 'api'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

  const configService = app.get(ConfigService)
  const frontednUrl = configService.get('FRONTEND_URL')

  app.enableCors({
    origin: [frontednUrl],
    methods: ['GET', 'POST'],
    credentials: true,
  })

  await app.register(fastifyCookie, {
    secret: configService.get('COOKIES_SIGNATURE'),
  })

  app.setGlobalPrefix(globalPrefix)

  const port = process.env.PORT_API || 3001

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(port)
  Logger.log(`🚀 Api service is running on: http://localhost:${port}/${globalPrefix}`)
}
bootstrap()
