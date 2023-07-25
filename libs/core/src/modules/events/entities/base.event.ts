import { IsEnum, IsNotEmpty, IsObject, IsString } from "class-validator";
import { EventObjectType, IBaseEvent } from "@market-connector/types";

export abstract class BaseEvent implements IBaseEvent {
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
