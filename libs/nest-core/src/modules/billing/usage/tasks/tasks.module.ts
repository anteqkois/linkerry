import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SubscriptionsModule } from '../../subscriptions/subscriptions.module'
import { TasksUsageModelFactory } from './tasks.schema'
import { TasksUsageService } from './tasks.service'

@Module({
  imports: [MongooseModule.forFeatureAsync([TasksUsageModelFactory]), SubscriptionsModule],
  providers: [TasksUsageService],
  exports: [TasksUsageService],
})
export class TasksUsageModule {}
