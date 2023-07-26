import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../lib/auth';
import { ReqJWTUser } from '../../lib/auth/decorators/req-user.decorator';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dto/create-alert.dto';
import { TradingViewGateway } from './trading-view/trading-view.gateway';
import { AlertProvidersType, JWTUser } from '@market-connector/types';

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
  createAlert(@ReqJWTUser() user: JWTUser, @Body() dto: CreateAlertDto) {
    return this.alertsService.createAlert(dto, user.id)
  }
}
