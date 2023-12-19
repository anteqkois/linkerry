import { IStrategyBuy_UpdateInput } from '@market-connector/types'
import { CreateStrategyBuyDto } from './create.dto'
import { IsNumber, IsOptional } from 'class-validator'

export class UpdateStrategyBuyDto extends CreateStrategyBuyDto implements IStrategyBuy_UpdateInput {
  @IsNumber()
  readonly triggeredTimes: number

  @IsNumber()
  readonly validityUnix: number

  @IsOptional()
  readonly conditionMarketProvider?: string
}
