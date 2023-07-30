import { EventObjectType, IBaseEvent } from '../event'

export interface IEventCondition extends IBaseEvent {
  data: {
    id: string
    object: EventObjectType.CONDITION
    value: number
  }
  // type: EventTypeType.CONDITION_TRIGGERED
}

export interface IAlertTradingViewTriggerInput {
  conditionId: string
  ticker: string
  close: string
}
