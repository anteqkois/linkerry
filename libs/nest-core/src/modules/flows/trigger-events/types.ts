import { TriggerEvent, WithoutId } from '@linkerry/shared'

export type SaveTriggerEventInput = Omit<WithoutId<TriggerEvent>, 'sourceName'> & { sourceName?: string }
