import { Id, JwtUser } from '@market-connector/types';
import { Body, Controller, Param, Patch, Post, Put } from '@nestjs/common';
import { ReqJwtUser } from '../../lib/auth/decorators/req-user.decorator';
import { UseJwtGuard } from '../../lib/utils/decorators/jwt-auth-guard.decorator';
import { StrategiesBuyService } from './strategies-buy.service';
import { UpdateStrategyBuyDto } from './dro/update.dto';
import { CreateStrategyBuyDto } from './dro/create.dto';
import { PatchStrategytBuyDto } from './dro/patch.dto';

@UseJwtGuard()
@Controller('strategies-buy')
export class StrategiesBuyController {
  constructor(private readonly strategiesBuyService: StrategiesBuyService) {}

  @Post('/')
  create(@ReqJwtUser() user: JwtUser,@Body() dto: CreateStrategyBuyDto){
    return this.strategiesBuyService.create(dto, user.id)
  }

  @Put('/:id')
  update(@ReqJwtUser() user: JwtUser, @Body() dto: UpdateStrategyBuyDto, @Param('id') id: Id) {
    return this.strategiesBuyService.update(dto, user.id, id)
  }

  @Patch('/:id')
  patch(@ReqJwtUser() user: JwtUser, @Body() dto: PatchStrategytBuyDto, @Param('id') id: Id) {
    return this.strategiesBuyService.patch(dto, user.id, id)
  }
}
