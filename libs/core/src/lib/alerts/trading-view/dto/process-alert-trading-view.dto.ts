import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ProcessAlertTradinViewDto {
  @IsString()
  @IsNotEmpty()
  readonly alertId: string

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  @IsNotEmpty()
  readonly ticker: string

  @IsString()
  @IsNotEmpty()
  readonly close: string
}
