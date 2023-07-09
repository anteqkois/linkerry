import { Module } from '@nestjs/common';
import { ExternalAlertService } from './external-alert.service';
import { ExternalAlertController } from './external-alert.controller';
import { ConfigService } from '@nestjs/config';
import { KafkaModule } from '../../common/kafka/kafka.module';

@Module({
  imports: [KafkaModule],
  controllers: [ExternalAlertController],
  providers: [ExternalAlertService]
})
export class ExternalAlertModule { }
