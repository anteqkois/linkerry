import { KafkaModule } from '@market-connector/core';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AlertLinkModule } from './modules/alert-link/alert-link.module';
import { AlertModule } from './modules/alert/alert.module';
import { MongodbModule } from './common/mongodb/mongodb.module';

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
    AlertModule,
    AlertLinkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
