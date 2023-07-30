import { EventObjectType, IEventCondition } from '@market-connector/types'
import { Type } from 'class-transformer'
import { IsDefined, IsEnum, IsNotEmptyObject, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator'
import { BaseEventDto } from '../../events/dto/base.event.dto'

export class EventConditionDataDto {
  @IsString()
  @IsDefined()
  id: string

  @IsString()
  @IsEnum(EventObjectType)
  object: EventObjectType.CONDITION

  @IsNumber()
  @IsDefined()
  value: number
}

export class EventConditionDto extends BaseEventDto implements IEventCondition {
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => EventConditionDataDto)
  override data!: EventConditionDataDto
}
