import { EventPayload, PopulatedFlow } from "@linkerry/shared"

export interface CallbackParams  {
    flow: PopulatedFlow
    payload: EventPayload
}

export interface HandshakeParams  {
    flow: PopulatedFlow
    payload: EventPayload
    simulate: boolean
}


export interface SyncParams  {
    flow: PopulatedFlow
    payload: EventPayload
    synchronousHandlerId?: string
}
