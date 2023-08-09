import { IUser } from '../user'
import { IAlertTradingView, IAlertUnknown } from './alert'

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

export interface ICondition_Populated extends Omit<ICondition, 'user'> {
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
}

export interface ICondition_CreateResponse {
  condition: ICondition
}
