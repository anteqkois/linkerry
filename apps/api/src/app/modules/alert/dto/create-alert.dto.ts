import { AlertProvidersType } from '@market-connector/core';
import { IsBoolean, IsEnum, IsMongoId, IsNotEmpty } from "class-validator";

export class CreateAlertDto {
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

  // // Crete tisker module
  // @IsString()
  // @IsNotEmpty()
  // readonly ticker: string

  @IsMongoId()
  @IsNotEmpty()
  readonly condition: string

  @IsBoolean()
  @IsNotEmpty()
  readonly testMode: boolean
}
