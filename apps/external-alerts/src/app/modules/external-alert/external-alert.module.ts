import { Module } from '@nestjs/common';
import { KafkaModule } from '../../common/kafka/kafka.module';
import { ExternalAlertController } from './external-alert.controller';
import { ExternalAlertService } from './external-alert.service';

@Module({
  imports: [KafkaModule.register({ clientId: 'external-alerts-0' })],
  controllers: [ExternalAlertController],
  providers: [ExternalAlertService]
})
export class ExternalAlertModule { }
