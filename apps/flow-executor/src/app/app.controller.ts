import { Controller } from '@nestjs/common'

import { AppService } from './app.service'
import { MessagePattern } from '@nestjs/microservices'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ role: 'metadata', cmd: 'get' })
  createItem(name: string) {
    return this.appService.getMetadata(name)
  }
}
