import { ConditionsConsumer } from '@market-connector/nest-core';
import { Module } from '@nestjs/common';
import { ConditionsController } from './conditions.controller';


@Module({
  controllers: [ConditionsController],
  providers: [ConditionsConsumer]
})
export class ConditionsModule { }
