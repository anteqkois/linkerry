import { IBaseEvent } from "../event"
import { ConditionTypeType } from "./condition"

export interface IConditionEvent extends IBaseEvent {
  data: {
    type: ConditionTypeType
    value: string
  }
}
