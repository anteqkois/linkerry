import { IStrategy_StaticMarket_PatchInput } from '@market-connector/types'
import { UpdateStrategyStaticMarketDto } from './update-static-market.dto copy'
import { PartialType } from '@nestjs/mapped-types'

export class PatchStrategyStaticMarketDto extends PartialType(UpdateStrategyStaticMarketDto) implements IStrategy_StaticMarket_PatchInput {}
