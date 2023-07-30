import { EventObjectType, EventTypeType, IBaseEvent } from '@market-connector/types'
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
  @IsEnum(EventObjectType)
  object: EventObjectType
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
  @IsEnum(EventTypeType)
  type: EventTypeType
}
