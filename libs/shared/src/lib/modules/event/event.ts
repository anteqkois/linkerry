export enum EventObject {
  Condition = 'Condition',
}

export enum EventType {
  ConditionTriggered = 'condition.triggered',
}

export interface IBaseEvent {
  id: string
  createdUnix: number
  data: {
    object: EventObject
  }
  type: EventType
}
