import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FlowVersionsService } from './flow-versions.service'
import { flowVersionModelFactory } from './schemas/flow-version.schema'
// import { FlowVersionsController } from './flow-versions.controller';

@Module({
  imports: [MongooseModule.forFeatureAsync([flowVersionModelFactory])],
  // controllers: [FlowVersionsController],
  providers: [FlowVersionsService],
  exports: [FlowVersionsService],
})
export class FlowVersionsModule {}
