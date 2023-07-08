import { Module } from '@nestjs/common';
import { ConditionService } from './condition.service';
import { ConditionController } from './condition.controller';

@Module({
  controllers: [ConditionController],
  providers: [ConditionService]
})
export class ConditionModule {}
