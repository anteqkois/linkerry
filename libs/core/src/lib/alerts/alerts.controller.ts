import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { JwtAuthGuard } from '../auth';
import { ReqUser } from '../auth/decorators/req-user.decorator';
import { JWTUser } from '../auth/types';
import { TradingViewService } from './trading-view/trading-view.service';
import { AlertProvidersType } from './models';

@Controller('alerts')
export class AlertsController {
  constructor(
    private readonly alertsService: AlertsService,
    private readonly tradingViewService: TradingViewService,
    ) {
      alertsService.registerPaymentGateway(AlertProvidersType.TRADING_VIEW, tradingViewService)
    }

  @UseGuards(JwtAuthGuard)
  @Post()
  createAlert(@ReqUser() user: JWTUser, @Body() dto: CreateAlertDto) {
    return this.alertsService.createAlert(dto, user.id)
  }
}
