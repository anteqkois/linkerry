import { Body, Controller, Post } from '@nestjs/common';
import { AlertsProcessor } from '../alerts.processor';
import { ProcessAlertTradinViewDto } from './dto/process-alert-trading-view.dto';

@Controller('trading-view')
export class TradingViewController {
  // constructor(private readonly alertsProcessor: AlertsProcessor) { }

  // TODO add protection, to use only by whitelist servers
  // @UseGuards(JwtAuthGuard)
  @Post()
  createAlert(@Body() dto: ProcessAlertTradinViewDto) {
    // return this.alertsProcessor.handleTradinViewAlert(dto)
  }
}
