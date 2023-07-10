import { IsEnum, IsNotEmpty, IsObject, IsString } from "class-validator";

export enum EventObjectType {
  CONDITION = 'condition',
}

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  readonly event_id: string;


  @IsString()
  @IsEnum(EventObjectType)
  readonly object: EventObjectType;

  @IsString()
  @IsObject()
  readonly data: {};
}
