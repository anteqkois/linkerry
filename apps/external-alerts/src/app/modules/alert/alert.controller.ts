import { Body, Controller, Post } from '@nestjs/common';
import { AlertService } from './alert.service';
import { CreateAlertTradinViewDto } from './dto/create-alert-trading-view.dto';

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  // Create universal dto, and decide based on path key from where alerts come
  @Post()
  create(@Body() externalAlertDto: CreateAlertTradinViewDto) {
    return this.alertService.processAlert(externalAlertDto);
  }
}
