export enum EventObjectType {
  CONDITION = 'condition',
}

export enum EventTypeType {
  CONDITION_TRIGGERED = 'condition.triggered',
}

export interface IBaseEvent {
  id: string
  createdUnix: number
  data: {
    object: EventObjectType
  }
  type: EventTypeType
}
