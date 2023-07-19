import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AlertsModule, AllExceptionsFilter, KafkaModule, RequestLoggerMiddleware } from '@market-connector/core'
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // MongooseModule.forFeatureAsync([{
    //   name: User.name,
    //   useFactory: () => {
    //     const schema = UserSchema;
    //     schema.plugin(require('mongoose-unique-validator'), { message: 'Email or nick exists' }); // or you can integrate it without the options   schema.plugin(require('mongoose-unique-validator')
    //     return schema;
    //   },
    // },])
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class CoreModule {
  // let's add a middleware on all routes
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  // }
}
