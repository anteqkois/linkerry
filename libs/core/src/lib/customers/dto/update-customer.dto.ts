import { IsBoolean, IsDate, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {
  // @IsNotEmpty()
  // @IsEnum(CustomerRoleTypes)
  // roles: CustomerRoleTypes[];

  @IsOptional()
  @IsBoolean()
  telegramBotConnected?: boolean;

  @IsOptional()
  @IsDate()
  emailVerifiedAtDate?: Date;

  @IsOptional()
  @IsDate()
  trialExpiredAtDate?: Date;

  @IsOptional()
  @IsDate()
  trialStartedAtDate?: Date;
}

