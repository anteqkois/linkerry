import { NEST_TOKENS } from '@market-connector/shared'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class ConnectorsService {
  constructor(@Inject(NEST_TOKENS.FLOW_EXECUTOR) private readonly flowExecutorClient: ClientProxy) {}

  async getMetadata(name: string) {
    return this.flowExecutorClient.send('metadata', { connector: name })
  }

  async triggerValidate(name: string, triggerName: string) {
    return this.flowExecutorClient.send('trigger.validate', {
      connector: name,
      trigger: triggerName,
    })
  }
}
