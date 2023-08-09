import { Id, JwtUser } from '@market-connector/types';
import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ReqJwtUser } from '../../lib/auth/decorators/req-user.decorator';
import { UseJwtGuard } from '../../lib/utils/decorators/jwt-auth-guard.decorator';
import { CreateStrategyBuyStaticMarketDto } from './dro/create-strategy-buy-static-market.dto';
import { StrategiesBuyService } from './strategies-buy.service';
import { UpdateStrategyBuyStaticMarketDto } from './dro/update-strategy-buy-static-market.dto';

@Controller('strategies-buy')
export class StrategiesBuyController {
  constructor(private readonly strategiesBuyService: StrategiesBuyService) {}

  @UseJwtGuard()
  @Post('/static-market')
  createStaticMarket(@ReqJwtUser() user: JwtUser,@Body() dto: CreateStrategyBuyStaticMarketDto){
    return this.strategiesBuyService.createStaticMarket(dto, user.id)
  }

  @UseJwtGuard()
  @Put('/static-market/:id')
  updateStaticMarket(@ReqJwtUser() user: JwtUser, @Body() dto: UpdateStrategyBuyStaticMarketDto, @Param('id') id: Id) {
    return this.strategiesBuyService.updateStaticMarket(dto, user.id, id)
  }
}
