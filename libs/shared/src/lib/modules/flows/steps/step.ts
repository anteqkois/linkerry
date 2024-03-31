import { Action } from '../actions'
import { TriggerConnector, TriggerNotEmpty } from '../triggers'

export type StepNotEmpty = Action | TriggerNotEmpty

export type ActionSchemaGraph = Action & { nextAction: ActionSchemaGraph | null }
export type TriggerSchemaGraph = TriggerConnector & { nextAction: ActionSchemaGraph | null }
