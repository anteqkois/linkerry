import { IStrategyBuy_StaticMarket_Input, IStrategyBuy_StaticMarket_MarketsInput, Id } from '@market-connector/types'
import { CreateStrategyBuy } from './create-strategy-buy.dto'
import { IsInt, IsMongoId, IsString, Max, MaxLength, Min, MinLength, ValidateNested } from 'class-validator'
import { Transform, Type } from 'class-transformer'

class StrategyBuyStaticMarket implements IStrategyBuy_StaticMarket_MarketsInput {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  readonly group: string

  @IsMongoId()
  readonly id: Id

  @IsInt()
  @Min(1)
  @Max(20)
  @Transform(({ value }) => Number.parseInt(value))
  readonly priority: number
}

export class CreateStrategyBuyStaticMarket extends CreateStrategyBuy implements IStrategyBuy_StaticMarket_Input {
  @ValidateNested({ each: true })
  @Type(() => StrategyBuyStaticMarket)
  readonly markets: Array<IStrategyBuy_StaticMarket_MarketsInput>
}
