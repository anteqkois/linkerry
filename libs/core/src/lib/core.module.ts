import { Module } from '@nestjs/common';
import { ConditionModule } from './modules/condition/condition.module';

@Module({
  imports:[ConditionModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class CoreModule {}
