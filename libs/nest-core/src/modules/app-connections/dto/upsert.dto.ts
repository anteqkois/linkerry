import { AppConnectionType, UpsertAppConnectionInput } from '@linkerry/shared'
import { IsDefined, IsEnum, IsObject, IsString } from 'class-validator'

export class UpsertAppConnectionDto implements Omit<UpsertAppConnectionInput, 'type'> {
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
