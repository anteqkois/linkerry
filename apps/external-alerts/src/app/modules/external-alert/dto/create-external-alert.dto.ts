import { IsNotEmpty, IsString } from "class-validator";

export class CreateExternalAlertTradinViewDto {
  @IsString()
  @IsNotEmpty()
  readonly alertId: string;
}
