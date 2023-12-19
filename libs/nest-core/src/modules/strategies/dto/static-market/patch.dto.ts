import { IStrategy_StaticMarket_PatchInput } from '@market-connector/types'
import { PartialType } from '@nestjs/mapped-types'
import { UpdateStrategyStaticMarketDto } from './update.dto'

export class PatchStrategyStaticMarketDto extends PartialType(UpdateStrategyStaticMarketDto) implements IStrategy_StaticMarket_PatchInput {}
