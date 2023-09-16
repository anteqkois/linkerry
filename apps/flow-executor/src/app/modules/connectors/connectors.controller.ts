import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { ConnectorsService } from './connectors.service'

@Controller()
export class ConnectorsController {
  constructor(private readonly connectorsService: ConnectorsService) {}

  @MessagePattern('metadata')
  getMetadata({ name }: { name: string }) {
    return this.connectorsService.getMetadata(name)
  }
}
