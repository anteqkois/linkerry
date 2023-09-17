import { Action, ActionType } from "./action"
import { TriggerType } from "./trigger"

export type SampleData = {
  currentSelectedData: unknown
  // customizedInputs: Record<string, any>
  lastTestDate: Date
}

export interface BaseStep {
  name: string
  valid: boolean
  displayName: string
  type: ActionType | TriggerType
  nextAction?: Action
}

export interface BaseConnectorSettings {
  connectorName: string // '@market-connecotr/connector/binance'
  name: string // name of trigger or action
  version: string,
  input: Record<string, any> & { auth?: string }
  sampleData: SampleData,
}
