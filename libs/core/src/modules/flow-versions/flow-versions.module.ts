import { Module } from '@nestjs/common';
import { FlowVersionsService } from './flow-versions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { flowVersionFactory } from './schemas/flow-version.schema';
// import { FlowVersionsController } from './flow-versions.controller';

@Module({
  imports:[  MongooseModule.forFeatureAsync([flowVersionFactory])],
  // controllers: [FlowVersionsController],
  providers: [FlowVersionsService],
  exports: [FlowVersionsService]
})
export class FlowVersionsModule {}
