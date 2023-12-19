import { IStrategyBuy_ConditionCreateInput } from '@market-connector/types'
import { IsBoolean } from 'class-validator'
import { CreateConditionDto } from '../../../conditions/dto/create.dto'

export class CreateStrategyBuyConditionDto extends CreateConditionDto implements IStrategyBuy_ConditionCreateInput {
  @IsBoolean()
  readonly active: boolean
}
