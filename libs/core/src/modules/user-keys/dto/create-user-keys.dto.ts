import { ExchangeCode, IUserKeysInput } from '@market-connector/types'
import { IsEnum, IsMongoId, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateUserKeysDto implements IUserKeysInput {
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

  @IsMongoId()
  @IsNotEmpty()
  readonly user: string

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
