import { Body, Controller, Get, Post } from '@nestjs/common';
import { CondictionService } from './condiction.service';

@Controller('condiction')
export class CondictionController {
  constructor(private readonly condictionService: CondictionService) {}

  @Get()
  getCondition(){}

  @Post()
  createCondition(@Body() createConditionDto){

  }
}
