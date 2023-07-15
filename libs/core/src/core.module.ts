import { Module } from '@nestjs/common';
import { KafkaModule } from './lib/kafka/kafka.module';

@Module({
  imports: [
    KafkaModule,
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
export class CoreModule { }
