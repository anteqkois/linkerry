import { IsNotEmpty, IsString } from "class-validator";

export class CreateAlertTradinViewDto {
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
