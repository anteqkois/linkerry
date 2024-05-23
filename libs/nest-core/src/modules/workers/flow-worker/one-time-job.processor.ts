import { Id } from '@linkerry/shared'
import { InjectQueue, OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job, Queue } from 'bullmq'
import { inspect } from 'util'
import { FlowWorkerService } from './flow-worker.service'
import { OneTimeJobData, QUEUES } from './queues/types'

@Processor(QUEUES.NAMES.ONE_TIME_JOB_QUEUE, {
  concurrency: 10,
})
export class OneTimeProcessor extends WorkerHost {
  private readonly logger = new Logger(OneTimeProcessor.name)

  constructor(@InjectQueue(QUEUES.NAMES.ONE_TIME_JOB_QUEUE) readonly OneTimeQueue: Queue, private readonly flowWorkerService: FlowWorkerService) {
    super()
  }

  async process(job: Job<OneTimeJobData, unknown, Id>): Promise<any> {
    this.logger.debug(`#process new job`, job.data)
    try {
      await this.flowWorkerService.executeFlow(job.data)
    } catch (error: any) {
      this.logger.error(
        `#process error job=`,
        inspect(
          {
            name: job.name,
            options: job.opts,
            id: job.id,
            data: job.data,
            processedOn: job.processedOn,
            failedReason: job.failedReason,
          },
          { depth: null },
        ),
      )
      this.logger.error(error.stack)
      throw error
      // captureException(e)
    }
  }

  @OnWorkerEvent('completed')
  onCompleted() {
    this.logger.debug(`Cemplete job`)
  }
}
