import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
// import { CronModule } from './lib/cron/cron.module'
import { MongodbModule } from './lib/mongodb'
import { PackageManagerModule } from './lib/package-manager/package-manager.module'
import { AllExceptionsFilter, RequestLoggerMiddleware } from './lib/utils'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongodbModule,
    PackageManagerModule,
    // CronModule,
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
