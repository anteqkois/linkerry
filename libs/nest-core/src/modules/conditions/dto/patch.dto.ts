import { ICondition_PatchInput } from '@market-connector/types'
import { PartialType } from '@nestjs/mapped-types'
import { UpdateConditionDto } from './update.dto'

export class PatchConditionDto extends PartialType(UpdateConditionDto) implements ICondition_PatchInput {}
