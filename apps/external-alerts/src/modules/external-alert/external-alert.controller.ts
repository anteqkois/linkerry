import { Body, Controller, Post } from '@nestjs/common';
import { CreateExternalAlertDto } from './dto/create-external-alert-trading-view.dto';
import { ExternalAlertService } from './external-alert.service';

@Controller('external-alert')
export class ExternalAlertController {
  constructor(private readonly externalAlertService: ExternalAlertService) {}

  @Post()
  create(@Body() createExternalAlertDto: CreateExternalAlertDto) {
    return this.externalAlertService.processAlert(createExternalAlertDto);
  }
}
