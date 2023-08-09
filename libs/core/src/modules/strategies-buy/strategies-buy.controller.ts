import { JwtUser } from '@market-connector/types';
import { Body, Controller, Post } from '@nestjs/common';
import { ReqJwtUser } from '../../lib/auth/decorators/req-user.decorator';
import { UseJwtGuard } from '../../lib/utils/decorators/jwt-auth-guard.decorator';
import { CreateStrategyBuyStaticMarketDto } from './dro/create-strategy-buy-static-market.dto';
import { StrategiesBuyService } from './strategies-buy.service';

@Controller('strategies-buy')
export class StrategiesBuyController {
  constructor(private readonly strategiesBuyService: StrategiesBuyService) {}

  @UseJwtGuard()
  @Post('/static-market/static')
  createStrategyStaticMarket(@ReqJwtUser() user: JwtUser,@Body() dto: CreateStrategyBuyStaticMarketDto){
    return this.strategiesBuyService.createStrategyStaticMarket(dto, user.id)
  }
}
