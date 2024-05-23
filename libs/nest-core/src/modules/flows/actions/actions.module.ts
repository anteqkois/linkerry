import { Module } from '@nestjs/common'
import { EngineModule } from '../../engine/engine.module'
import { FlowVersionsModule } from '../flow-versions/flow-versions.module'
import { ActionsController } from './actions.controller'
import { ActionsService } from './actions.service'

@Module({
  imports: [FlowVersionsModule, EngineModule],
  controllers: [ActionsController],
  providers: [ActionsService],
})
export class ActionsModule {}
