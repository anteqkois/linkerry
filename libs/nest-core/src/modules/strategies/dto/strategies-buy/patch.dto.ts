import { IsBoolean, IsOptional } from 'class-validator'
import { PatchStrategytBuyDto } from '../../../strategies-buy/dro/patch.dto'
import { IStrategy_StrategyBuyPatchInput } from '@market-connector/types'

export class PatchStrategyStrategyBuyDto extends PatchStrategytBuyDto implements  IStrategy_StrategyBuyPatchInput {
  @IsOptional()
  @IsBoolean()
  active?: boolean
}
