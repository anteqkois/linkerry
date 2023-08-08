import { EventObject, IBaseEvent } from '../event'

export interface IEventCondition extends IBaseEvent {
  data: {
    id: string
    object: EventObject.Condition
    value: number
  }
  // type: EventTypeType.ConditionTriggered
}

export interface IAlertTradingView_TriggerInput {
  conditionId: string
  ticker: string
  close: string
}
