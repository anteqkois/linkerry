import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth';
import { ReqUser } from '../auth/decorators/req-user.decorator';
import { JWTUser } from '../auth/types';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { AlertProvidersType } from './models';
import { TradingViewGateway } from './trading-view/trading-view.gateway';

@Controller('alerts')
export class AlertsController {
  constructor(
    private readonly alertsService: AlertsService,
    private readonly tradingViewService: TradingViewGateway,
    ) {
      alertsService.registerPaymentGateway(AlertProvidersType.TRADING_VIEW, tradingViewService)
    }

  @UseGuards(JwtAuthGuard)
  @Post()
  createAlert(@ReqUser() user: JWTUser, @Body() dto: CreateAlertDto) {
    return this.alertsService.createAlert(dto, user.id)
  }
}
