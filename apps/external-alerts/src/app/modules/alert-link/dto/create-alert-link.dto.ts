import { IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { AlertProvidersType } from '@market-connector/core'

export class CreateAlertLinkDto {
  // @IsString()
  // @IsNotEmpty()
  // link: string

  // @IsString()
  // @IsNotEmpty()
  // salt: string

  // @IsString()
  // @IsNotEmpty()
  // link: string

  @IsEnum(AlertProvidersType)
  @IsNotEmpty()
  readonly provider: AlertProvidersType

  // Crete tisker module
  @IsString()
  @IsNotEmpty()
  readonly ticker: string

  @IsMongoId()
  @IsNotEmpty()
  readonly condition: string

  @IsBoolean()
  @IsNotEmpty()
  readonly testMode: boolean
}
