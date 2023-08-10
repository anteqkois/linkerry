import { IStrategyBuy_Condition, IStrategyBuy_StaticMarket_UpdateInput } from '@market-connector/types'
import { CreateStrategyBuyStaticMarketDto } from './create-strategy-buy-static-market.dto'
import { ArrayMaxSize, ArrayMinSize, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { StrategyBuyConditionDto } from './create-strategy-buy.dto'

export class UpdateStrategyBuyStaticMarketDto extends CreateStrategyBuyStaticMarketDto implements IStrategyBuy_StaticMarket_UpdateInput {
  readonly _id: string
  readonly user: string
  readonly triggeredTimes: number
  readonly validityUnix: number

  @IsArray()
  // @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => StrategyBuyConditionDto)
  override readonly conditions: IStrategyBuy_Condition[]
}
