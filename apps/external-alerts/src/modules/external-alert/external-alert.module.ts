import { Module } from '@nestjs/common';
import { ExternalAlertService } from './external-alert.service';
import { ExternalAlertController } from './external-alert.controller';
import { KafkaProducerProvider } from '../../common/kafka/kafka-producer.provider';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [ExternalAlertController],
  providers: [ExternalAlertService, KafkaProducerProvider, ConfigService]
})
export class ExternalAlertModule { }
