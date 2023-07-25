import { Language } from '@market-connector/types';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, MaxLength, MinLength, ValidateNested } from 'class-validator';

class ConsentsDto {
  [key: string]: boolean;
}

export class CreateUserDto{
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @MinLength(2)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @MinLength(3)
  phone?: string;

  @IsOptional()
  @IsString()
  telegramId?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  // @MaxLength(34)
  // @MinLength(62)
  @Length(42)
  cryptoWallet?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  language: Language;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ConsentsDto)
  consents: ConsentsDto;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  referrerId?: string;
}
