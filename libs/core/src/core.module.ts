import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './lib/utils';
import { ConfigModule } from '@nestjs/config';
import { MongodbModule } from './lib/mongodb';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongodbModule
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
  // let's add a middleware on all routes
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  // }
}
