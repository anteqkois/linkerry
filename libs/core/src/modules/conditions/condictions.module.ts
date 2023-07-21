import { Module } from '@nestjs/common';
import { CondictionsController } from './condictions.controller';
import { CondictionsService } from './condictions.service';

@Module({
  controllers: [CondictionsController],
  providers: [CondictionsService]
})
export class CondictionsModule {}
