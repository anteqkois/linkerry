import { BaseConnectorSettings, BaseTrigger, TriggerType } from '@market-connector/shared'
import { IsDefined, IsOptional } from 'class-validator'

// // export class UpdateTriggerDto implements BaseStep {
// export class UpdateTriggerEmptyDto implements TriggerEmpty {
// 	@IsDefined()
// 	name: string

// 	@IsDefined()
// 	displayName: string

// 	@IsOptional()
// 	nextActionName?: string

// 	@IsDefined()
// 	type: TriggerType.Empty

// 	@IsDefined()
// 	valid: boolean

// 	@IsOptional()
// 	settings: any
// }

// export class UpdateTriggerConnecotrDto implements TriggerConnector {
// 	@IsDefined()
// 	name: string

// 	@IsDefined()
// 	displayName: string

// 	@IsOptional()
// 	nextActionName?: string

// 	@IsDefined()
// 	type: TriggerType.Connector

// 	@IsDefined()
// 	valid: boolean

// 	@IsOptional()
// 	settings: BaseConnectorSettings
// }

// export class UpdateTriggerWebhookDto implements TriggerWebhook {
// 	@IsDefined()
// 	name: string

// 	@IsDefined()
// 	displayName: string

// 	@IsOptional()
// 	nextActionName?: string

// 	@IsDefined()
// 	type: TriggerType.Webhook

// 	@IsDefined()
// 	valid: boolean

// 	@IsOptional()
// 	settings: TriggerWebhook['settings']
// }

// export class UpdateTriggerDto extends IntersectionType(UpdateTriggerEmptyDto, UpdateTriggerConnecotrDto, UpdateTriggerWebhookDto) {}

export class UpdateTriggerDto
	// implements Omit<TriggerEmpty, 'type'>, Omit<TriggerWebhook, 'type' | 'settings'>, Omit<TriggerConnector, 'type' | 'settings'>
	implements BaseTrigger
{
	@IsDefined()
	name: string

	@IsDefined()
	displayName: string

	@IsOptional()
	nextActionName?: string

	@IsDefined()
	// type: TriggerType.Connector | TriggerType.Empty | TriggerType.Webhook
	type: TriggerType

	@IsDefined()
	valid: boolean

	@IsOptional()
	settings: BaseConnectorSettings
}
