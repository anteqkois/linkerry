import { ConnectorType, ConnectorsGetOptionsInput, Id } from '@linkerry/shared'
import { IsDefined, IsObject, IsString } from 'class-validator'

export class ConnectorsGetOptionsInputDto implements ConnectorsGetOptionsInput {
  @IsDefined()
	@IsString()
	readonly connectorName: string

  @IsDefined()
	@IsString()
	readonly connectorType: ConnectorType

  @IsDefined()
	@IsString()
	readonly connectorVersion: string

  @IsDefined()
	@IsString()
	readonly flowId: Id

  @IsDefined()
	@IsString()
	readonly flowVersionId: Id

  @IsDefined()
	@IsObject()
	readonly input: any

  @IsDefined()
	@IsString()
	readonly propertyName: string

  @IsDefined()
	@IsString()
	readonly stepName: string
}
