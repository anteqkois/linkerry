import { IStrategy_UpdateInput, StrategyState } from '@market-connector/types'
import { CreateStrategyDto } from './create.dto'
import { IsEnum, IsNumber, IsString } from 'class-validator'

export class UpdateStrategyDto extends CreateStrategyDto implements IStrategy_UpdateInput {
  @IsNumber()
  readonly triggeredTimes: number

  @IsNumber()
  readonly validityUnix: number

  @IsString()
  @IsEnum(StrategyState)
  readonly state: StrategyState
}
