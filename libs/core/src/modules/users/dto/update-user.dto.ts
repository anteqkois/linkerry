import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  // @IsNotEmpty()
  // @IsEnum(UserRoleTypes)
  // roles: UserRoleTypes[];

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

