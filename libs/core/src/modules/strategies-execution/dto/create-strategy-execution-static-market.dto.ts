import {
  IStrategyExecution_StaticMarket_Input,
  IStrategyExecution_StaticMarket_MarketsInput,
  StrategyExecutionType,
} from '@market-connector/types'
import { Id } from '@market-connector/shared'
import { CreateStrategyExecutionDto } from './create-strategy-execution.dto'
import { IsInt, IsMongoId, IsString, Max, MaxLength, Min, MinLength, ValidateNested } from 'class-validator'
import { Transform, Type } from 'class-transformer'

class StrategyBuyStaticMarket implements IStrategyExecution_StaticMarket_MarketsInput {
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

export class CreateStrategyExecutionStaticMarketDto
  extends CreateStrategyExecutionDto
  implements IStrategyExecution_StaticMarket_Input
{
  @ValidateNested({ each: true })
  @Type(() => StrategyBuyStaticMarket)
  readonly markets: Array<IStrategyExecution_StaticMarket_MarketsInput>

  override readonly type: StrategyExecutionType
}
