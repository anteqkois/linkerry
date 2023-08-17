import { Id } from '../../utils'
import { ICondition, ICondition_CreateInput, ICondition_PatchInput } from '../condition'
import { IStrategyBuy_DynamicMarket_Property } from './strategy-dynamic-market'
import { StrategyBuy_StaticMarket_Property } from './strategy-static-market'

export enum StrategyBuyType {
  StrategyBuyDynamicMarket = 'StrategyBuyDynamicMarket',
  StrategyBuyStaticMarket = 'StrategyBuyStaticMarket',
}

export interface IStrategyBuy_Condition {
  id?: Id
  condition?: Id
  active: boolean
}

export interface IStrategyBuy_ConditionExpand {
  id?: Id
  condition?: ICondition
  active: boolean
}

export interface IStrategyBuy
  extends Partial<StrategyBuy_StaticMarket_Property>,
    Partial<IStrategyBuy_DynamicMarket_Property> {
  _id: Id
  user: Id
  type: StrategyBuyType
  name: string
  validityUnix: number
  triggeredTimes: number
  conditions: IStrategyBuy_Condition[]
}

// POST
export interface IStrategyBuy_CreateInput {
  type: StrategyBuyType
  name: string
  conditions: (IStrategyBuy_Condition & { conditionCreateInput?: ICondition_CreateInput })[]
}
export interface IStrategyBuy_CreateResponse extends IStrategyBuy {}

// PUT
export interface IStrategyBuy_UpdateInput extends Omit<IStrategyBuy, '_id' | 'user'> {}
export interface IStrategyBuy_UpdateResponse extends IStrategyBuy_CreateResponse {}

// PATCH
export interface IStrategyBuy_PatchInput extends Partial<IStrategyBuy_UpdateInput> {}
export interface IStrategyBuy_PatchResponse extends IStrategyBuy_UpdateResponse {}

// Conditions
// POST
export interface IStrategyBuy_ConditionCreateInput extends ICondition_CreateInput {
  active: boolean
}
export interface IStrategyBuy_ConditionCreateResponse extends IStrategyBuy_ConditionExpand {}

// PATCH
export interface IStrategyBuy_ConditionPatchInput extends Partial<ICondition_PatchInput> {
  active: boolean
}
export interface IStrategyBuy_ConditionPatchResponse extends IStrategyBuy_ConditionCreateResponse {}
