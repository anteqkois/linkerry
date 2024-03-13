import { ConnectorType, ConnectorsGetOptionsInput, Id, PackageType } from '@linkerry/shared'
import { IsDefined, IsEnum, IsObject, IsOptional, IsString } from 'class-validator'

export class ConnectorsGetOptionsInputDto implements ConnectorsGetOptionsInput {
  @IsDefined()
	@IsString()
	@IsEnum(PackageType)
	readonly packageType: PackageType

  @IsDefined()
	@IsString()
	readonly connectorName: string

  @IsDefined()
	@IsString()
	@IsEnum(ConnectorType)
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

  @IsOptional()
	@IsString()
	readonly searchValue?: string
}
