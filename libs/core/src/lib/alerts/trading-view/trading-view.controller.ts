import { Body, Controller, Post } from '@nestjs/common';
import { ProcessAlertTradinViewDto } from './dto/process-alert-trading-view.dto';
import { TradingViewGateway } from './trading-view.gateway';

@Controller('trading-view')
export class TradingViewController {
  constructor(private readonly tradingViewGateway: TradingViewGateway) { }

  // TODO add protection, to use only by whitelist servers
  @Post()
  createAlert(@Body() dto: ProcessAlertTradinViewDto) {
    return this.tradingViewGateway.conditionTriggeredEventEmiter(dto)
  }
}
