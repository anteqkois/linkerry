import { Body, Controller, Param, Post } from '@nestjs/common';
import { CreateExternalAlertTradinViewDto } from './dto/create-external-alert.dto';
import { ExternalAlertsService } from './external-alerts.service';

@Controller('external-alerts')
export class ExternalAlertsController {
  constructor(private readonly externalAlertsService: ExternalAlertsService) { }

  // Create universal dto, and decide based on path key from where alerts come
  // @Post()
  // create(@Body() externalAlertDto: CreateExternalAlertTradinViewDto) {
  //   return this.externalAlertsService.processAlert(externalAlertDto);
  // }
  @Post(':alertId')
  handleAlert(@Param() params: { alertId: string }) {
    
    // return this.externalAlertsService.processAlert(externalAlertDto);
  }
}
