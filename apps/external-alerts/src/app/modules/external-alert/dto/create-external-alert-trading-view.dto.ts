import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateExternalAlertTradinViewDto {
  @IsString()
  @IsNotEmpty()
  readonly ticker: string;

  @IsString()
  @IsNotEmpty()
  readonly price: string;

  @IsString()
  @IsNotEmpty()
  readonly volume: string;
}
