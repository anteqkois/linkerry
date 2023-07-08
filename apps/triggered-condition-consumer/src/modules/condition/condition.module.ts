import { Module } from '@nestjs/common';
import { KafkaModule } from '../../common/kafka/kafka.module';
import { ConditionConsumer } from './condition.consumer';
import { ConditionController } from './condition.controller';

@Module({
  imports: [
    ConditionModule,
    KafkaModule
  ],
  controllers: [ConditionController],
  providers: [ConditionConsumer]
})
export class ConditionModule { }
