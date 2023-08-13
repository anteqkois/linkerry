import { IStrategy_StaticMarket_PatchInput } from '@market-connector/types'
import { PatchStrategyDto } from '../patch.dto'

export class UpdateStrategyStaticMarketDto extends PatchStrategyDto implements IStrategy_StaticMarket_PatchInput {}
