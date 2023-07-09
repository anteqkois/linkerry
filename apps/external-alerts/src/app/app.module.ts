import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ExternalAlertModule } from './modules/external-alert/external-alert.module';
import { KafkaModule } from './common/kafka/kafka.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ExternalAlertModule,
    KafkaModule.register({ clientId: 'external-alerts-0' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
