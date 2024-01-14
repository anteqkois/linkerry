import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { MongodbModule } from './lib/mongodb'
import { AllExceptionsFilter, RequestLoggerMiddleware } from './lib/utils'
// import { EngineModule } from './modules/flows/engine/engine.module'
// import { SandboxModule } from './modules/workers/sandbox/sandbox.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongodbModule,
    // SandboxModule,
    // EngineModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // To register as a global guard
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
  exports: [],
})
export class CoreModule {
  // Add a middleware on all routes
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*')
  }
}
