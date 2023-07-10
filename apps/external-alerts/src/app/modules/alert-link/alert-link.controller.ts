import { Body, Controller, Post } from '@nestjs/common';
import { AlertLinkService } from './alert-link.service';
import { CreateAlertLinkDto } from './dto/create-alert-link.dto';

@Controller('alert-link')
export class AlertLinkController {
  constructor(private readonly alertLinkService: AlertLinkService) { }

  @Post()
  generateAlertLink(@Body() createAlertLinkDto: CreateAlertLinkDto) {
    return this.alertLinkService.generateLink(createAlertLinkDto);
  }
}
