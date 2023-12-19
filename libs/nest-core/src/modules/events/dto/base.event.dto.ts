import { EventObject, EventType, IBaseEvent } from '@market-connector/types'
import { Type } from 'class-transformer'
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator'

export class BaseEventDataDto {
  @IsString()
  @IsEnum(EventObject)
  object: EventObject
}

export class BaseEventDto implements IBaseEvent {
  @IsString()
  @IsNotEmpty()
  id: string

  @IsNumber()
  @IsNotEmpty()
  createdUnix: number

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => BaseEventDataDto)
  data!: BaseEventDataDto

  @IsString()
  @IsEnum(EventType)
  type: EventType
}
