import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExternalAlertModule } from './modules/external-alert/external-alert.module';
import { KafkaModule } from './common/kafka/kafka.module';
import { KafkaProducerProvider } from './common/kafka/kafka-producer.provider';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', }),
    ExternalAlertModule,
    // KafkaModule,
  ],
  controllers: [AppController],
  providers: [AppService, KafkaProducerProvider],
})
export class AppModule { }
