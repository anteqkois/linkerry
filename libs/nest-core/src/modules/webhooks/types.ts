import { EventPayload, Flow, Id } from "@linkerry/shared"

export type WebhookUrlSuffix = '' | '/simulate'

export interface GetWebhookUrlParams {
    flowId: Id
    simulate?: boolean
}

export interface CallbackParams  {
    flow: Flow
    payload: EventPayload
}

export interface HandshakeParams  {
    flow: Flow
    payload: EventPayload
    simulate: boolean
}


export interface SyncParams  {
    flow: Flow
    payload: EventPayload
    synchronousHandlerId?: string
}
