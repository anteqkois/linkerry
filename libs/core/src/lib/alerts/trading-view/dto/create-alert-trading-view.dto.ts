import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { CreateAlertDto } from "../../dto/create-alert.dto";
import { AlertProvidersType } from "../../models";

export class CreateAlertTradinViewDto extends CreateAlertDto {
  @IsString()
  @IsNotEmpty()
  override readonly alertProvider: AlertProvidersType.TRADING_VIEW;
  
  @IsString()
  @IsOptional()
  readonly messagePattern?: string
}
