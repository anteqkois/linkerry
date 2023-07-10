import { Body, Controller, Post } from '@nestjs/common';
import { CreateExternalAlertTradinViewDto } from './dto/create-external-alert.dto';
import { ExternalAlertService } from './external-alert.service';

@Controller('external-alert')
export class ExternalAlertController {
  constructor(private readonly alertService: ExternalAlertService) {}

  // Create universal dto, and decide based on path key from where alerts come
  @Post()
  create(@Body() externalAlertDto: CreateExternalAlertTradinViewDto) {
    return this.alertService.processAlert(externalAlertDto);
  }
}
