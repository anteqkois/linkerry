import { Module } from '@nestjs/common';
import { ConditionsController } from './conditions.controller';
import { ConditionsConsumer } from '@market-connector/core';


@Module({
  controllers: [ConditionsController],
  providers: [ConditionsConsumer]
})
export class ConditionsModule { }
