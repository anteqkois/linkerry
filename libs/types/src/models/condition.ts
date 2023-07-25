import { IBaseEvent } from "./events"
import { IndicatorType } from "./indicator"
import { IUser } from "./user"

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

export interface IConditionInput {
  type: ConditionTypeType
  symbol?: string
  value: string
  operator: ConditionOperatorType
  triggered: boolean
  triggeredTimes: number
  indicator?: IndicatorType
  testMode: boolean
}

export interface IConditionResponse {
  user: any
  status: string
}

export interface IConditionEvent  extends IBaseEvent {
  data: {
    type: ConditionTypeType
    value: string
  }
}

export interface ICondition{
  _id: string;
  user: IUser;
  name: string;
  type: ConditionTypeType;
  requiredValue: number;
  operator: ConditionOperatorType;
  active: boolean;
  eventValidityUnix: number;
  symbol?: string
  testMode: boolean
}
