import fastifyCookie from '@fastify/cookie'
import { exceptionFactoryDto } from '@market-connector/nest-core'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app/app.module'

const globalPrefix = 'api'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

  const configService = app.get(ConfigService)
  const frontednUrl = configService.get('FRONTEND_URL')

  app.enableCors({
    origin: [frontednUrl],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })

  await app.register(fastifyCookie, {
    secret: configService.get('COOKIES_SIGNATURE'),
  })

  app.setGlobalPrefix(globalPrefix)

  const port = process.env.PORT_API || 3001

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: exceptionFactoryDto,
      whitelist: true
    }),
  )

  await app.listen(port)
  Logger.log(`🚀 Api service is running on: http://localhost:${port}/${globalPrefix}`)
}
bootstrap()
