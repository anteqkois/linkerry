import { IsEnum, IsNotEmpty, IsObject, IsString } from "class-validator";
import { EventObjectType } from "../models";

export abstract class BaseEvent {
  @IsString()
  @IsNotEmpty()
  event_id: string;

  @IsString()
  @IsEnum(EventObjectType)
  object: EventObjectType;

  @IsString()
  @IsObject()
  abstract readonly data: {};
}
