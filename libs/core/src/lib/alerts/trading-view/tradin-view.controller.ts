import { Body, Controller, Post } from '@nestjs/common';
import { AlertsService } from '../alerts.service';
import { TradinViewDto } from './trading-view.dto';
import { AlertsProcessor } from '../alerts.processor';

@Controller('tradin-view')
export class TradinViewController {
  constructor(private readonly alertsProcessor: AlertsProcessor) { }

  // TODO add protection, to use only by whitelist servers
  // @UseGuards(JwtAuthGuard)
  @Post()
  createAlert(@Body() dto: TradinViewDto) {
    return this.alertsProcessor.handleTradinViewAlert(dto)
  }
}
