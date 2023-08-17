import { IsBoolean } from 'class-validator'
import { CreateConditionDto } from '../../../conditions/dto/create-condition.dto'
import { IStrategyBuy_ConditionCreateInput } from '@market-connector/types'

export class CreateStrategyBuyConditionDto extends CreateConditionDto implements IStrategyBuy_ConditionCreateInput {
  @IsBoolean()
  readonly active: boolean
}
