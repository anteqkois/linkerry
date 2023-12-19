import {
  IAlertTradingView_TriggerInput,
} from '@market-connector/types'
import {
  IsNotEmpty, IsString, MaxLength, MinLength,
} from 'class-validator'

export class TriggerAlertTradingViewDto implements IAlertTradingView_TriggerInput {
  @IsString()
  @IsNotEmpty()
  readonly conditionId: string

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @IsNotEmpty()
  readonly ticker: string

  @IsString()
  @IsNotEmpty()
  readonly close: string
}
