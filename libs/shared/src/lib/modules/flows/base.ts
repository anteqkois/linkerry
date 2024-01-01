import { ActionType } from './action'
import { TriggerType } from './trigger'

export type SampleData = {
  currentSelectedData: unknown
  // customizedInputs: Record<string, any>
  lastTestDate: Date
}

export interface BaseStep {
  id: string
  valid: boolean
  displayName: string
  type: ActionType | TriggerType
  nextActionId?: string
}

export interface BaseConnectorSettings {
  connectorId: string
  connectorName: string // '@market-connecotr/binance'
  triggerName: string // 'new_row'
  connectorVersion: string
  input: Record<string, any> & { auth?: string }
  sampleData?: SampleData
}
