import { Module } from '@nestjs/common';
import { CondictionService } from './condiction.service';
import { CondictionController } from './condiction.controller';

@Module({
  controllers: [CondictionController],
  providers: [CondictionService]
})
export class CondictionModule {}
