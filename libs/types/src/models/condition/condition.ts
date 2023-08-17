import { IUser } from '../user'
import { AlertProvider, IAlertTradingView, IAlertUnknown } from './alert'

export enum ConditionType {
  Alert = 'Alert',
  Indicator = 'Indicator',
}

// It's important in condition, not Event
export enum ConditionOperator {
  Equal = 'Equal',
  Crossing = 'Crossing',
  CrossingUp = 'CrossingUp',
  CrossingDown = 'CrossingDown',
  GreaterThan = 'GreaterThan',
  LessThan = 'LessThan',
  // Entering Channel= '' // User must defined bands
  // Exiting Channel= ''
  // Inside Channel= ''
  // Outside Channel= ''
  MovingUp = 'MovingUp', // Value => $300
  MovingDown = 'MovingDown',
  MovingUpPercent = 'MovingUpPercent', // % => 10%
  MovingDownPercent = 'MovingDownPercent',
}

// Stay with convenction I... :/
export interface ICondition {
  _id: string
  type: ConditionType
  user: string
  name: string
  requiredValue: number
  operator: ConditionOperator
  triggeredTimes: number
  eventValidityUnix: number
  isMarketProvider: boolean
  // Alert Condition fields
  alert?: IAlertTradingView | IAlertUnknown
  // Indicator Condition fields
  indicator?: any
}

export interface IConditionExpanded extends Omit<ICondition, 'user'> {
  user: IUser
}

export interface ICondition_CreateInput {
  name: string
  type: ConditionType
  requiredValue: number
  operator: ConditionOperator
  eventValidityUnix: number
  isMarketProvider: boolean
  // readonly required: boolean;                 // for future usecase
  // Alert Condition fields
  alert?: {
    provider: AlertProvider
  }
  // Indicator Condition fields
  // indicator?: any
}
export interface ICondition_CreateResponse extends ICondition {}

// PUT
export interface ICondition_UpdateInput extends Omit<ICondition, '_id' | 'user' | 'alert'> {}
export interface ICondition_UpdateResponse extends ICondition {}

// PATCH
export interface ICondition_PatchInput extends Partial<ICondition_UpdateInput> {}
export interface ICondition_PatchResponse extends ICondition {}
