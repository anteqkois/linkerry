import { DatabaseTimestampKeys, TriggerEvent } from '@linkerry/shared'

// export type SaveTriggerEventInput = Omit<TriggerEvent, '_id' | 'sourceName' | 'createdAt' | 'updatedAt'> & { sourceName?: string }
export type SaveTriggerEventInput = Omit<TriggerEvent, '_id' | 'sourceName' | DatabaseTimestampKeys> & { sourceName?: string }
