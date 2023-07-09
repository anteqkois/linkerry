import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConditionModule } from './modules/condition/condition.module';
import { KafkaModule } from '@market-connector/core'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KafkaModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        clientId: 'conddition-consumer-0',
        brokerUrl: configService.get('KAFKA_CONDITION_BROKER_URL'),
        groupId: configService.get('KAFKA_CONDITION_GROUP_ID'),
      }),
    }),
    ConditionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
