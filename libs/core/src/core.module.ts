import { Module } from '@nestjs/common';
import { AlertsModule } from './lib/alerts/alerts.module';
import { AuthModule } from './lib/auth/auth.module';
import { KafkaModule } from './lib/kafka/kafka.module';
import { WinstonModule } from 'nest-winston';
import { UserSettingsModule } from './lib/user-settings/user-settings.module';
import { UsersModule } from './lib/users/users.module';
import { WinstonConfig } from './lib/logger/winston.config';
import { LoggerModule } from './lib/logger/logger.module';

@Module({
  imports: [
    KafkaModule,
    UsersModule,
    UserSettingsModule,
    AlertsModule,
    AuthModule,
    WinstonModule.forRoot(WinstonConfig),
    LoggerModule,
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
