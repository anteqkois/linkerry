import { Module } from '@nestjs/common';
import { TasksUsageModule } from './tasks/tasks.module';
import { UsageController } from './usage.controller';
import { UsageService } from './usage.service';

@Module({
  controllers: [UsageController],
  providers: [UsageService],
  imports: [TasksUsageModule]
})
export class UsageModule {}
