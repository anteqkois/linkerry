import { BaseConnectorSettings, BaseTrigger, ConnectorType, TriggerConnector, TriggerConnectorSettings, TriggerType } from '@linkerry/shared'
import { Type } from 'class-transformer'
import { IsDefined, IsNotEmptyObject, IsOptional, ValidateNested } from 'class-validator'

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

// class UpdateTriggerSettingsDto implements BaseTrigger{}

class BaseConnectorSettingsDto implements BaseConnectorSettings {
	@IsDefined()
	connectorName: string

	@IsDefined()
	connectorType: ConnectorType

	@IsDefined()
	connectorVersion: string

	@IsDefined()
	input: any

	@IsDefined()
	inputUiInfo: any

	@IsOptional()
	sampleData?: any
}

export class UpdateTriggerBaseDto implements BaseTrigger {
	@IsDefined()
	name: string

	@IsDefined()
	displayName: string

	@IsDefined()
	nextActionName: string

	@IsDefined()
	type: TriggerType

	@IsDefined()
	valid: boolean

	@IsNotEmptyObject()
	@ValidateNested()
	@Type(() => BaseConnectorSettingsDto)
	settings: BaseConnectorSettings
	// @IsObject()
	// settings: BaseConnectorSettings
}

class TriggerConnectorSettingsDto implements TriggerConnectorSettings {
	@IsDefined()
	connectorName: string

	@IsDefined()
	connectorType: ConnectorType

	@IsDefined()
	connectorVersion: string

	@IsDefined()
	triggerName: string

	@IsDefined()
	input: any

	@IsDefined()
	inputUiInfo: any

	@IsOptional()
	sampleData?: any
}

export class UpdateTriggerConnectorDto implements TriggerConnector {
	@IsDefined()
	name: string

	@IsDefined()
	displayName: string

	@IsDefined()
	nextActionName: string

	@IsDefined()
	type: TriggerType.CONNECTOR

	@IsDefined()
	valid: boolean

	@IsNotEmptyObject()
	@ValidateNested()
	@Type(() => TriggerConnectorSettingsDto)
	settings: TriggerConnectorSettings
}

// export class UpdateTriggerDto
// 	implements BaseTrigger
// {
// 	@IsDefined()
// 	name: string

// 	@IsDefined()
// 	displayName: string

// 	@IsDefined()
// 	nextActionName: string

// 	@IsDefined()
// 	// type: TriggerType.Connector | TriggerType.Empty | TriggerType.Webhook
// 	type: TriggerType

// 	@IsDefined()
// 	valid: boolean

// 	// @IsNotEmptyObject()
// 	// @ValidateNested()
// 	// @Type(() => User)
// 	@IsObject()
// 	settings: BaseConnectorSettings | TriggerConnectorSettings
// }
