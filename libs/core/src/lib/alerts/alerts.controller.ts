import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { JwtAuthGuard } from '../auth';
import { FastifyRequest } from 'fastify';
import { User } from '../users';
import { ReqUser } from '../auth/decorators/req-user.decorator';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  createAlert(@ReqUser() user: User, @Body() createAlertDto: CreateAlertDto) {
    console.log(user);
    return this.alertsService.createAlert(createAlertDto)
  }
}
