import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { JwtAuthGuard } from '../auth';
import { FastifyRequest } from 'fastify';
import { User, UserDocument } from '../users';
import { ReqUser } from '../auth/decorators/req-user.decorator';
import { JWTUser } from '../auth/types';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) { }

  // Add more secure logic
  // @UseGuards(JwtAuthGuard)
  // @Get()
  // getUser(@ReqUser() user: JWTUser) {
  //   console.log('FROM ALERT', user);
  //   return {mess: '124312'}
  // }

  @UseGuards(JwtAuthGuard)
  @Post()
  createAlert(@ReqUser() user: JWTUser, @Body() dto: CreateAlertDto) {
    console.log(dto);
    console.log('IN ALERT', user, dto);
    return this.alertsService.createAlert(dto, user.id)
  }
}
