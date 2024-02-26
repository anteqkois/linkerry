import { Injectable, Logger } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'

@Injectable()
export class CronProvider {
  private logger = new Logger(CronProvider.name)

  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  async registerCronJob(crontime: string, cronJobName: string, callback: (...args: any) => any) {
    const job = new CronJob(crontime, () => {
      callback()
    })

    this.schedulerRegistry.addCronJob(cronJobName, job)
    this.logger.log(`Added: ${cronJobName}: ${crontime}`)
    job.start()
  }
}
