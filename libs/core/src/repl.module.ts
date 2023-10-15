import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
// import { CronModule } from './lib/cron/cron.module'
import { MongodbModule } from './lib/mongodb'
import { AllExceptionsFilter, RequestLoggerMiddleware } from './lib/utils'
import { CoreModule } from './core.module'
import { ConnectorsMetadataModule } from './modules/connectors-metadata'

@Module({
  imports:[ConnectorsMetadataModule]
  // imports: [
  //   ConfigModule.forRoot({
  //     isGlobal: true,
  //   }),
  //   MongodbModule,
  //   // CronModule,
  // ],
  // controllers: [],
  // providers: [
  //   {
  //     provide: APP_FILTER,
  //     useClass: AllExceptionsFilter,
  //   },
  //   // To register as a global guard
  //   // {
  //   //   provide: APP_GUARD,
  //   //   useClass: JwtAuthGuard,
  //   // },
  // ],
  // exports: [],
})
export class ReplModule extends CoreModule {}
// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),
//     MongodbModule,
//     // CronModule,
//   ],
//   controllers: [],
//   providers: [
//     {
//       provide: APP_FILTER,
//       useClass: AllExceptionsFilter,
//     },
//     // To register as a global guard
//     // {
//     //   provide: APP_GUARD,
//     //   useClass: JwtAuthGuard,
//     // },
//   ],
//   exports: [],
// })
// export class CoreModule {
//   // Add a middleware on all routes
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(RequestLoggerMiddleware).forRoutes('*')
//   }
// }
