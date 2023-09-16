import { Injectable } from '@nestjs/common'
import { ConnectorsService } from '../connectors/connectors.service'

@Injectable()
export class TriggersService {
  constructor(private readonly connectorService: ConnectorsService) {}

  validate(connectorName: string, triggerName: string, data: any) {
    const trigger = this.connectorService.getConnector(connectorName).getTrigger(triggerName)
    // todo implement test logic
  }
}
