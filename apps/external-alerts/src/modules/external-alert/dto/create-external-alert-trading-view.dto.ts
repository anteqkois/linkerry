import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateExternalAlertDto {
  @IsNumber()
  @IsNotEmpty()
  readonly ticker: string;
}
