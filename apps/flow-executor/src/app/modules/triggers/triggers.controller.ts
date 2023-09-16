import { Controller } from '@nestjs/common'
import { TriggersService } from './triggers.service'
import { MessagePattern } from '@nestjs/microservices'

@Controller()
export class TriggersController {
  constructor(private readonly triggersService: TriggersService) {}

  @MessagePattern('trigger.validate')
  getMetadata({ name, triggerName, data }: { name: string; triggerName: string; data: any }) {
    return this.triggersService.validate(name, triggerName, data)
  }
}
