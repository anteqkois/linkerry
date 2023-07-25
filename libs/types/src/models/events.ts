export enum EventObjectType {
  CONDITION = 'condition',
}

export interface IBaseEvent {
  event_id: string
  object: EventObjectType
  data: {}
}
