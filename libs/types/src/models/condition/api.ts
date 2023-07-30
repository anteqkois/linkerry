import { AlertProviderType } from './alert'
import { ConditionOperatorType, ConditionTypeType, ICondition } from './condition'

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

export interface IConditionResponse {
  condition: ICondition
}

export interface IAlertInput extends IConditionInput {
  type: ConditionTypeType.ALERT
  alert: {
    provider: AlertProviderType
  }
}
