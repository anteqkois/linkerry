import { Module } from '@nestjs/common';
import { FlowsService } from './flows.service';
import { FlowsController } from './flows.controller';

@Module({
  controllers: [FlowsController],
  providers: [FlowsService]
})
export class FlowsModule {}
