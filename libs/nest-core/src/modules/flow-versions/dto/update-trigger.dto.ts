import { BaseStep, TriggerType } from '@market-connector/shared'
import { IsDefined } from 'class-validator'

export class UpdateTriggerDto implements BaseStep {
  @IsDefined()
  id: string

  displayName: string
  nextActionId?: string | undefined
  type: TriggerType
  valid: boolean
}
