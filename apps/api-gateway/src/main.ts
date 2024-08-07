import fastifyCookie from '@fastify/cookie'
import fastifyMultipart from '@fastify/multipart'
import { corsHeadersPlugin } from '@linkerry/nest-core'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { AppModule } from './app/app.module'

const globalPrefix = '/api/v1'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      // logger: (process.env['LOG_LEVELS'].split(',') as LogLevel[]) ?? (['error', 'log', 'verbose', 'warn'] as LogLevel[]),
      // logger: (process.env['LOG_LEVELS'].split(',') as LogLevel[]) ?? (['error', 'log', 'verbose', 'warn'] as LogLevel[]),
      logger: {
        // level: (process.env['LOG_LEVELS'].split(',') as LogLevel[]) ?? (['error', 'log', 'verbose', 'warn'] as LogLevel[])
        // level: ['']
        level: 'error',
      },
    }),
    {
      rawBody: true,
    },
  )

  const configService = app.get(ConfigService)
  const frontendUrl = configService.getOrThrow('FRONTEND_HOST')
  if (!frontendUrl.length) console.error('FRONTEND_HOST is empty')

  app.enableCors({
    origin: frontendUrl,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })

  // Register CORS headers plugin, to fix if they are missing (issue with Brave browser and missing headers)
  await app.register(corsHeadersPlugin)

  await app.register(fastifyMultipart, {
    attachFieldsToBody: 'keyValues',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async onFile(part: any) {
      const buffer = await part.toBuffer()
      part.value = buffer
    },
  })

  await app.register(fastifyCookie, {
    secret: configService.get('COOKIES_SIGNATURE'),
  })

  app.setGlobalPrefix(globalPrefix)

  const port = process.env.PORT_API_GATEWAY || 3001
  const host = process.env.ENV === 'prod' ? '0.0.0.0' : '127.0.0.1'

  await app.listen(port, host)
  Logger.log(`🚀 Api service is running on: http://${host}:${port}${globalPrefix}`)
}

bootstrap()
