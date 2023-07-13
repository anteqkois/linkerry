import { IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { AlertProvidersType } from "../types";

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

  @IsOptional()
  @IsMongoId()
  @IsNotEmpty()
  readonly condition?: string

  @IsBoolean()
  @IsNotEmpty()
  readonly testMode: boolean
}
