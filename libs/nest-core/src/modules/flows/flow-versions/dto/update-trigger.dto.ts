// import { BaseConnectorSettings, BaseTrigger, ConnectorType, TriggerType } from '@linkerry/shared'
// import { Type } from 'class-transformer'
// import { IsDefined, IsNotEmptyObject, IsOptional, ValidateNested } from 'class-validator'

// class BaseConnectorSettingsDto implements BaseConnectorSettings {
// 	@IsDefined()
// 	connectorName: string

// 	@IsDefined()
// 	connectorType: ConnectorType

// 	@IsDefined()
// 	connectorVersion: string

// 	@IsDefined()
// 	input: any

// 	@IsDefined()
// 	inputUiInfo: any

// 	@IsOptional()
// 	sampleData?: any
// }

// export class UpdateTriggerBaseDto implements BaseTrigger {
// 	@IsDefined()
// 	name: string

// 	@IsDefined()
// 	displayName: string

// 	@IsDefined()
// 	nextActionName: string

// 	@IsDefined()
// 	type: TriggerType

// 	@IsDefined()
// 	valid: boolean

// 	@IsNotEmptyObject()
// 	@ValidateNested()
// 	@Type(() => BaseConnectorSettingsDto)
// 	settings: BaseConnectorSettings
// }
