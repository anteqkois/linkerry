import { IsNotEmpty, IsString } from "class-validator";

export class TradinViewDto {
  @IsString()
  @IsNotEmpty()
  readonly alertId: string

  @IsString()
  @IsNotEmpty()
  readonly ticker: string

  @IsString()
  @IsNotEmpty()
  readonly close: string
}
