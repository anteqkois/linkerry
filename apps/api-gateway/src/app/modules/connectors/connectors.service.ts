import { NEXT_TOKENS } from '@market-connector/shared'
import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class ConnectorsService {
  constructor(@Inject(NEXT_TOKENS.FLOW_EXECUTOR) private readonly flowExecutorClient: ClientProxy) {}

  async getMetadata(name: string) {
    return this.flowExecutorClient.send(
      {
        role: 'metadata',
        cmd: 'get',
      },
      name,
    )
  }
}
