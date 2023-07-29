import { AlertProviderType, IAlertTradingView, IAlertUnknown } from './alert'
import { IBaseEvent } from './event'
import { IUser } from './user'

export enum ConditionTypeType {
  ALERT = 'alert',
  INDICATOR = 'indicator',
}

// It's important in condition, not Event
export enum ConditionOperatorType {
  EQUAL = 'equal',
  CROSSING = 'crossing',
  CROSSING_UP = 'crossingUp',
  CROSSING_DOWN = 'crossingDown',
  GREATER_THAN = 'greaterThan',
  LESS_THAN = 'lessThan',
  // Entering Channel= '' // User must defined bands
  // Exiting Channel= ''
  // Inside Channel= ''
  // Outside Channel= ''
  MOVING_UP = 'movingUp', // Value => $300
  MOVING_DOWN = 'movingDown',
  MOVING_UP_PERCENT = 'MovingUpPercent', // % => 10%
  MOVING_DOWN_PERCENT = 'MovingDownPercent',
}

export interface IConditionEvent extends IBaseEvent {
  data: {
    type: ConditionTypeType
    value: string
  }
}

export interface IConditionIndicator extends ICondition {
  type: ConditionTypeType.INDICATOR
  indicator: {}
}

export interface IConditionAlert extends ICondition {
  type: ConditionTypeType.ALERT
  alert: IAlertTradingView | IAlertUnknown
}

// Stay with convenction I... :/
export interface ICondition {
  _id: string
  type: ConditionTypeType
  user: string
  name: string
  requiredValue: number
  operator: ConditionOperatorType
  triggeredTimes: number
  active: boolean
  eventValidityUnix: number
  testMode: boolean
  isMarketProvider: boolean
  // Alert Condition fields
  alert?: IAlertTradingView | IAlertUnknown
  // Indicator Condition fields
  indicator?: any
}

export interface IConditionPopulated extends Omit<ICondition, 'user'> {
  user: IUser
}

// # # # # #    API    # # # # #

export interface IConditionInput {
  name: string
  type: ConditionTypeType
  requiredValue: number
  operator: ConditionOperatorType
  eventValidityUnix: number
  testMode: boolean
  isMarketProvider: boolean
  active: boolean
  // readonly required: boolean;                 // for future usecase
}

export interface IConditionAlertInput extends IConditionInput {
  type: ConditionTypeType.ALERT
  alert: {
    provider: AlertProviderType
  }
}

export interface IConditionResponse {
  condition: ICondition
}
