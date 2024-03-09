import { EventPayload, FlowPopulated } from "@linkerry/shared"

export interface CallbackParams  {
    flow: FlowPopulated
    payload: EventPayload
}

export interface HandshakeParams  {
    flow: FlowPopulated
    payload: EventPayload
    simulate: boolean
}


export interface SyncParams  {
    flow: FlowPopulated
    payload: EventPayload
    synchronousHandlerId?: string
}
