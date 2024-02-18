import { AppConnectionType, UpsertAppConnectionBody } from '@linkerry/shared'
import { IsDefined, IsEnum, IsObject, IsString } from 'class-validator'

export class UpsertAppConnectionDto implements UpsertAppConnectionBody {
	@IsDefined()
	@IsString()
	connectorName: string

	@IsDefined()
	@IsString()
	name: string

	@IsDefined()
	@IsString()
	@IsEnum(AppConnectionType)
	type: AppConnectionType

	@IsDefined()
	@IsObject()
	value: any
}
