import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  readonly object: string;

  @IsString()
  @IsNotEmpty()
  readonly id: string;
}