import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppConnectionsModelFactory } from '../../app-connections/schemas/connections.schema'
import { FlowModelFactory } from '../../flows/flows/schemas/flow.schema'
import { TasksUsageModule } from './tasks/tasks.module'
import { UsageController } from './usage.controller'
import { UsageService } from './usage.service'

@Module({
	imports: [MongooseModule.forFeatureAsync([AppConnectionsModelFactory, FlowModelFactory]), TasksUsageModule],
	controllers: [UsageController],
	providers: [UsageService],
})
export class UsageModule {}
