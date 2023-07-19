import { Body, Controller, Get, Post } from '@nestjs/common';
import { CondictionsService } from './condictions.service';

@Controller('condictions')
export class CondictionsController {
  constructor(private readonly condictionsService: CondictionsService) {}

  @Get()
  getCondition(){}

  // @Post()
  // createCondition(@Body() createConditionDto){

  // }
}
