import { Controller, Get, Param } from '@nestjs/common';
import { ConnectorsService } from './connectors.service';

@Controller('connectors')
export class ConnectorsController {
  constructor(private readonly connectorsService: ConnectorsService) {}

  @Get('metadata/:name')
  findOne(@Param('name') name: string) {
    return this.connectorsService.getMetadata(name);
  }
}
