import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { AlertProvidersType } from "../models";

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
  readonly alertValidityUnix: number;

  @IsString()
  @IsOptional()
  readonly symbol?: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly testMode: boolean
}
