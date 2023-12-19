import { KafkaModule } from '@market-connector/nest-core';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConditionsModule } from './modules/conditions/conditions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KafkaModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        clientId: 'conddition-consumer-0',
        brokerUrl: configService.get('KAFKA_BROKER_URL'),
        groupId: configService.get('KAFKA_CONDITION_GROUP_ID'),
      }),
    }),
    ConditionsModule,
  ],
  controllers: [AppController, ],
  providers: [AppService],
})
export class AppModule { }
