import { Id, TriggerTestStrategy, WebhookSimulation } from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { WebhookSimulationService } from '../../webhooks/webhook-simulation/webhook-simulation.service'
import { TriggerEventsService } from '../trigger-events/trigger-events.service'

@Injectable()
export class TestTriggerService {
  private readonly logger = new Logger(TestTriggerService.name)

  constructor(private readonly webhookSimulationService: WebhookSimulationService, private readonly triggerEventsService: TriggerEventsService) {}

  async _executeSimulation({ flowId, flowVersionId, projectId }: ExecuteTestParams): Promise<WebhookSimulation> {
    this.logger.debug(`#_executeSimulation`, {
      flowId,
      flowVersionId,
      projectId,
    })

    return this.webhookSimulationService.create({
      flowId,
      flowVersionId,
      projectId,
    })
  }

  async _executeTestFunction({ flowId, flowVersionId, projectId, triggerName, userId }: ExecuteTestParams) {
    this.logger.debug(`#_executeTestFunction`, {
      flowId,
      flowVersionId,
      projectId,
    })

    return this.triggerEventsService.test(
      {
        flowId: flowId,
        triggerName,
      },
      projectId,
      userId,
    )
  }

  async test(params: TestParams): Promise<unknown> {
    const { testStrategy, ...executeParams } = params

    const testExecutors: Record<TriggerTestStrategy, (p: ExecuteTestParams) => Promise<unknown>> = {
      [TriggerTestStrategy.SIMULATION]: this._executeSimulation,
      [TriggerTestStrategy.TEST_FUNCTION]: this._executeTestFunction,
    }

    const executor = testExecutors[testStrategy]
    return executor(executeParams)
  }
}

type TestParams = {
  flowId: Id
  flowVersionId: Id
  projectId: Id
  testStrategy: TriggerTestStrategy
  triggerName: string
  userId: Id
}

type ExecuteTestParams = Omit<TestParams, 'testStrategy'>
