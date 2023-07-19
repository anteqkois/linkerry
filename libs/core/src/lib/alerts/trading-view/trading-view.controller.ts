import { Body, Controller, Get, Post } from '@nestjs/common';
import { AlertsProcessor } from '../alerts.processor';
import { TradinViewDto } from './trading-view.dto';

@Controller('trading-view')
export class TradingViewController {
  constructor(private readonly alertsProcessor: AlertsProcessor) { }

  // TODO add protection, to use only by whitelist servers
  // @UseGuards(JwtAuthGuard)
  @Post()
  createAlert(@Body() dto: TradinViewDto) {
    return this.alertsProcessor.handleTradinViewAlert(dto)
  }
}
