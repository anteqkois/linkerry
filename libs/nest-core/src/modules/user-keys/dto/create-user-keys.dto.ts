import { ExchangeCode, IUserKeys_CreateInput } from '@market-connector/types'
import { IsEnum, IsMongoId, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateUserKeysDto implements IUserKeys_CreateInput {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  readonly name: string

  @IsMongoId()
  @IsNotEmpty()
  readonly exchange: string

  @IsEnum(ExchangeCode)
  @IsNotEmpty()
  readonly exchangeCode: ExchangeCode

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(100)
  readonly aKey: string

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(100)
  readonly sKey: string
}
