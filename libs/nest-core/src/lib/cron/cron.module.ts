import { Module } from '@nestjs/common'
import { CronProvider } from './cron'

@Module({
  providers: [CronProvider],
  exports: [CronProvider],
})
export class CronModule {}
