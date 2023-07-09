import { Body, Controller, Post } from '@nestjs/common';
import { CreateExternalAlertTradinViewDto } from './dto/create-external-alert-trading-view.dto';
import { ExternalAlertService } from './external-alert.service';

@Controller('external-alert')
export class ExternalAlertController {
  constructor(private readonly externalAlertService: ExternalAlertService) {}

  // Create universal dto, and decide based on path key from where alerts come
  @Post()
  create(@Body() createExternalAlertDto: CreateExternalAlertTradinViewDto) {
    return this.externalAlertService.processAlert(createExternalAlertDto);
  }
}
