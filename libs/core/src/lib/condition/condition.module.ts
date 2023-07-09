import { Module } from '@nestjs/common';
import { ConditionConsumer } from './condition.consumer';
import { ConditionController } from './condition.controller';

@Module({
  imports: [
    ConditionModule,
  ],
  controllers: [ConditionController],
  providers: [ConditionConsumer]
})
export class ConditionModule { }
