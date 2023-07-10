import { Module } from '@nestjs/common';
import { ConditionModule } from './condition/condition.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    ConditionModule,
    KafkaModule
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class CoreModule { }
