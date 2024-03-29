import fastifyCookie from '@fastify/cookie'
import { exceptionFactoryDto } from '@linkerry/nest-core'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app/app.module'

const globalPrefix = '/api/v1'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

  const configService = app.get(ConfigService)
  const frontendUrl = configService.get('FRONTEND_HOST')

  app.enableCors({
    origin: [frontendUrl],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })

  await app.register(fastifyCookie, {
    secret: configService.get('COOKIES_SIGNATURE'),
  })

  app.setGlobalPrefix(globalPrefix)

  const port = process.env.PORT_API_GATEWAY || 3001

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: exceptionFactoryDto,
      whitelist: true,
    }),
  )

  await app.listen(port)
  Logger.log(`🚀 Api service is running on: http://localhost:${port}${globalPrefix}`)
}

bootstrap()
