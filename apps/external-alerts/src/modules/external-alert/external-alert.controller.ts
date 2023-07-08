import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExternalAlertService } from './external-alert.service';
import { CreateExternalAlertDto } from './dto/create-external-alert.dto';
import { UpdateExternalAlertDto } from './dto/update-external-alert.dto';

@Controller('external-alert')
export class ExternalAlertController {
  constructor(private readonly externalAlertService: ExternalAlertService) {}

  @Post()
  create(@Body() createExternalAlertDto: CreateExternalAlertDto) {
    return this.externalAlertService.processAlert(createExternalAlertDto);
  }

  // @Get()
  // findAll() {
  //   return this.externalAlertService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.externalAlertService.findOne(+id);
  // }
}
