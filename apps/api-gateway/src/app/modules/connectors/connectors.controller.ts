import { Controller, Get, Param, Post } from '@nestjs/common'
import { ConnectorsService } from './connectors.service'

@Controller('connectors')
export class ConnectorsController {
  constructor(private readonly connectorsService: ConnectorsService) {}

  @Get('/:name/metadata')
  getMetadata(@Param('name') name: string) {
    return this.connectorsService.getMetadata(name)
  }

  @Post('/:name/trigger/:trigger-name/validate')
  findOne(@Param('name') name: string, @Param('trigger-name') triggerName: string) {
    return this.connectorsService.triggerValidate(name, triggerName)
  }
}
