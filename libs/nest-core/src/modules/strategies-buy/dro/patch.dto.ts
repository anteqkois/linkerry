import { IStrategyBuy_PatchInput } from '@market-connector/types'
import { PartialType } from '@nestjs/mapped-types'
import { UpdateStrategyBuyDto } from './update.dto'

export class PatchStrategytBuyDto extends PartialType(UpdateStrategyBuyDto) implements IStrategyBuy_PatchInput {}
