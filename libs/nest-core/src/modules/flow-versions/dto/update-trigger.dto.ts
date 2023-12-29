import { BaseConnectorSettings, TriggerConnector, TriggerEmpty, TriggerType, TriggerWebhook } from '@market-connector/shared'
import { IsDefined, IsOptional } from 'class-validator'

// export class UpdateTriggerDto implements BaseStep {
export class UpdateTriggerDto
  implements Omit<TriggerEmpty, 'type'>, Omit<TriggerWebhook, 'type' | 'settings'>, Omit<TriggerConnector, 'type' | 'settings'>
{
  @IsDefined()
  id: string

  @IsDefined()
  displayName: string

  @IsOptional()
  nextActionId?: string

  @IsDefined()
  type: TriggerType

  @IsDefined()
  valid: boolean

  @IsOptional()
  settings: BaseConnectorSettings
}
