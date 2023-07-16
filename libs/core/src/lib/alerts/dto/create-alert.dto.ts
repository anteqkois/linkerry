import { IsBoolean, IsDate, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { AlertProvidersType } from "../types";

export class CreateAlertDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsNotEmpty()
  readonly name: string

  @IsEnum(AlertProvidersType)
  @IsNotEmpty()
  readonly alertProvider: AlertProvidersType

  @IsBoolean()
  @IsNotEmpty()
  readonly active: boolean

  @IsNumber()
  @IsNotEmpty()
  alertValidityUnix: number;

  @IsString()
  @IsOptional()
  // @IsEnum(Ticker) // In future it can be enum from db ?
  readonly ticker?: string;

  // @IsOptional()
  // @IsMongoId()
  // @IsNotEmpty()
  // readonly condition?: string

  @IsBoolean()
  @IsNotEmpty()
  readonly testMode: boolean
}
