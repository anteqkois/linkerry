import { TriggerEmpty, TriggerType } from '../flows'

export const generateEmptyTrigger = (id: string): TriggerEmpty => {
  return {
    displayName: 'Select trigger',
    id,
    type: TriggerType.Empty,
    valid: false,
  }
}
