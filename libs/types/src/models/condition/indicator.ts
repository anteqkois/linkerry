import { ConditionType, ICondition } from './condition'

export enum IndicatorType {
  Default = 'Default',
  RSI = 'RSI',
}

export interface IIndicator extends ICondition {
  type: ConditionType.Indicator
  indicator: {
    type: IndicatorType
  }
}
