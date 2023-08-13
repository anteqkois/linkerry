import { IStrategyBuy_Condition, IStrategyBuy_UpdateInput } from '@market-connector/types'
import { Type } from 'class-transformer'
import { ArrayMaxSize, IsArray, ValidateNested } from 'class-validator'
import { CreateStrategyBuyDto, StrategyBuyConditionDto } from './create.dto'

export class UpdateStrategyBuyDto extends CreateStrategyBuyDto implements IStrategyBuy_UpdateInput {
  readonly triggeredTimes: number
  readonly validityUnix: number
  readonly conditionMarketProvider?: string

  @IsArray()
  // @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => StrategyBuyConditionDto)
  override readonly conditions: IStrategyBuy_Condition[]
}
