import { KafkaModule } from '@market-connector/core';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongodbModule } from './common/mongodb/mongodb.module';
import { ExternalAlertsModule } from './modules/external-alerts/external-alerts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    KafkaModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        clientId: 'external-alerts-0',
        brokerUrl: configService.get('KAFKA_BROKER_URL'),
        groupId: configService.get('KAFKA_CONDITION_GROUP_ID'),
      }),
    }),
    MongodbModule,
    ExternalAlertsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
