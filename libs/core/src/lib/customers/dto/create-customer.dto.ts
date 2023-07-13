import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ConsentsDto {
  [key: string]: boolean;
}

export class CreateCustomerDto {
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

  // @IsNotEmpty()
  // @IsString({ each: true })
  // roles: string[];

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
  language: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ConsentsDto)
  consents: ConsentsDto;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  referrerId?: string;
}
