import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { ConnectorsService } from './connectors.service'

@Controller()
export class ConnectorsController {
  constructor(private readonly connectorsService: ConnectorsService) {}

  @MessagePattern('metadata')
  getMetadata({ connector }: { connector: string }) {
    return this.connectorsService.getMetadata(connector)
  }
}