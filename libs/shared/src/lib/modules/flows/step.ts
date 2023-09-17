export enum StepType {
  Trigger = 'Trigger',
  Action = 'Action',
  // Code = 'Code',
  Branch = 'Branch',
  MergeBranch = 'MergeBranch',
}

export interface StepSettings {
  input: Record<string, any> & { auth?: string }
  connectorName: string // '@market-connecotr/connector/binance'
  name: string // name of trigger or action
  version: string
  inputUiInfo: {
    currentSelectedData: Record<string, any>
  }
}

export interface Step {
  name: string
  displayName: string
  type: StepType
  valid: boolean
  settings: StepSettings
}

export interface StepAction extends Step {
  type: StepType.Action
  nextAction?: StepAction
}

export interface StepTrigger extends Step {
  type: StepType.Trigger
  nextAction?: StepAction // | StepBranch etc
}
