import { Id } from "../../utils"
import { ICondition } from "../condition"
import { IStrategyBuy, StrategyBuyType } from "./strategy-buy"

export interface IStrategyBuy_DynamicMarket
  extends Omit<IStrategyBuy, keyof IStrategyBuy_DynamicMarket_Property>,
    Required<IStrategyBuy_DynamicMarket_Property> {
  type: StrategyBuyType.StrategyBuyDynamicMarket
}


export interface IStrategyBuy_DynamicMarket_Populated extends Omit<IStrategyBuy_DynamicMarket, 'conditionMarketProvider'> {
  conditionMarketProvider: ICondition
}

export interface IStrategyBuy_DynamicMarket_Property {
  conditionMarketProvider: Id
}
