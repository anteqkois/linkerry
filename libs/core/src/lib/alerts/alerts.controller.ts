import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { JwtAuthGuard } from '../auth';
import { ReqUser } from '../auth/decorators/req-user.decorator';
import { JWTUser } from '../auth/types';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  createAlert(@ReqUser() user: JWTUser, @Body() dto: CreateAlertDto) {
    return this.alertsService.createAlert(dto, user.id)
  }
}
