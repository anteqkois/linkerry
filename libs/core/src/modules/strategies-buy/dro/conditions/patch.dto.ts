import { IsBoolean, IsOptional } from 'class-validator'
import { IStrategyBuy_ConditionPatchInput } from '@market-connector/types'
import { PatchConditionDto } from '../../../conditions/dto/patch.dto'

export class PatchStrategyBuyConditionDto extends PatchConditionDto implements IStrategyBuy_ConditionPatchInput {
  @IsOptional()
  @IsBoolean()
  active: boolean
}
