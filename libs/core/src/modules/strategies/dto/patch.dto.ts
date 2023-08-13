import { IStrategy_PatchInput } from '@market-connector/types'
import { PartialType } from '@nestjs/mapped-types'
import { UpdateStrategyDto } from './update.dto'

export class PatchStrategyDto extends PartialType(UpdateStrategyDto) implements IStrategy_PatchInput {}
