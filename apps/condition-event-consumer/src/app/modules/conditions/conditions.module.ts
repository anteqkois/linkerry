import { Module } from '@nestjs/common';
import { ConditionsConsumer } from './conditions.consumer';
import { ConditionsController } from './conditions.controller';


@Module({
  controllers: [ConditionsController],
  providers: [ConditionsConsumer]
})
export class ConditionsModule {}
