import { Body, Controller, Post } from '@nestjs/common';
import { AlertService } from './alert.service';
import { CreateAlertDto } from './dto/create-alert.dto';

@Controller('alert')
export class AlertController {
  constructor(private readonly alertService: AlertService) { }

  @Post()
  createAlert(@Body() createAlertDto: CreateAlertDto) {
    return this.alertService.createAlert(createAlertDto)
  }
}
