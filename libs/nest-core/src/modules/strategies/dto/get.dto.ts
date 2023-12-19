import { IStrategy_GetOneQuery } from '@market-connector/types'
import { Transform } from 'class-transformer'
import { IsIn, IsOptional, IsString } from 'class-validator'

export class GetOneStrategyQueryDto implements IStrategy_GetOneQuery {
  @IsOptional()
  @IsString({ each: true })
  @IsIn(['user', 'strategyBuy.strategyBuy'], { each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') return [value]
    return value
  })
  readonly expand?: ('user' | 'strategyBuy.strategyBuy')[] | undefined
}
