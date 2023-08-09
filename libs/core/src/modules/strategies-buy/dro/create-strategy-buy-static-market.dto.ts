import { IStrategyBuy_StaticMarket_CreateInput } from '@market-connector/types'
import { CreateStrategyBuyDto } from './create-strategy-buy.dto'

export class CreateStrategyBuyStaticMarketDto extends CreateStrategyBuyDto implements IStrategyBuy_StaticMarket_CreateInput {}
