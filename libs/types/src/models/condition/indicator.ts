import { ConditionTypeType, ICondition } from './condition'

export enum IndicatorType {
  DEFAULT = 'default',
  RSI = 'rsi',
}

export interface IIndicator extends ICondition {
  type: ConditionTypeType.INDICATOR
  indicator: {
    type: IndicatorType
  }
}
