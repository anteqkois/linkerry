import { FastifyAdapter } from '@bull-board/fastify'
import { BullBoardModule } from '@bull-board/nestjs'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
// import * as basicAuth from '@fastify/basic-auth';
// import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis'
import { BullModule } from '@nestjs/bullmq'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { MongodbModule } from './lib/mongodb'
import { AllExceptionsFilter, RequestLoggerMiddleware } from './lib/nest-utils'
import { RedisLockModule } from './lib/redis-lock'
import { QUEUES } from './modules/workers/flow-worker/queues/types'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongodbModule,
    RedisLockModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        host: configService.getOrThrow('REDIS_HOST'),
        port: +configService.get('REDIS_PORT'),
        password: configService.get('REDIS_PASSWORD'),
        onClientReady: (client) => {
          client.on('error', (err: any) => {
            console.error(err)
          })
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync(QUEUES.CONFIG_KEYS.FLOW, {
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow('REDIS_HOST'),
          port: +configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    BullBoardModule.forRoot({
      route: '/anteq/queues',
      adapter: FastifyAdapter,
      boardOptions: {
        uiConfig: {
          boardTitle: 'Linkerry',
        },
      },
    }),
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      // maxListeners: 10,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.getOrThrow('GLOBAL_THROTTLE_TTL'),
          limit: config.getOrThrow('GLOBAL_THROTTLE_LIMIT'),
        },
      ],
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtCookiesAuthGuard,
    // },
  ],
  exports: [],
})
export class CoreModule implements NestModule {
  // Add a middleware on all routes
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*')
  }
}
