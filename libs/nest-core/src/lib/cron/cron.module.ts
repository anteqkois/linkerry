import { Module } from '@nestjs/common'
import { CronProvider } from './cron.provider'

@Module({
  providers: [CronProvider],
  exports: [CronProvider],
})
export class CronModule {}
