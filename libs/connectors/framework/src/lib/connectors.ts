import { Action } from './action/action'
import { ConnectorAuth } from './property/auth'
import { Trigger} from './trigger/trigger'

export class Connector {
  private readonly _actions: Record<string, Action> = {}
  private readonly _triggers: Record<string, Trigger> = {}

  constructor(
    public readonly name: string,
    public readonly displayName: string,
    public readonly logoUrl: string,
    public readonly description: string,
    triggers: Trigger[],
    actions: Action[],
    public readonly auth: ConnectorAuth | undefined,
    public readonly requiredAith: boolean,
  ) {
    actions.forEach((action) => (this._actions[action.name] = action))
    triggers.forEach((trigger) => (this._triggers[trigger.name] = trigger))
  }

  metadata() {
    return {
      displayName: this.displayName,
      logoUrl: this.logoUrl,
      actions: this._actions,
      triggers: this._triggers,
      description: this.description,
      auth: this.auth,
      // minimumSupportedRelease: this.minimumSupportedRelease,
      // maximumSupportedRelease: this.maximumSupportedRelease,
    }
  }

  getAction(actionName: string): Action | undefined {
    return this._actions[actionName]
  }

  getTrigger(triggerName: string): Trigger | undefined {
    return this._triggers[triggerName]
  }

  actions() {
    return this._actions
  }

  triggers() {
    return this._triggers
  }
}

type CreateConnectorParams = {
  name: string
  displayName: string
  logoUrl: string
  description: string
  auth?: ConnectorAuth
  requiredAuth?: boolean
  // events?: ConnectorEventProcessors
  // minimumSupportedRelease?: string
  // maximumSupportedRelease?: string
  actions: Action[]
  triggers: Trigger[]
}

export const createConnector = (params: CreateConnectorParams): Connector => {
  return new Connector(
    params.name,
    params.displayName,
    params.logoUrl,
    params.description,
    params.triggers,
    params.actions,
    params.auth,
    params.requiredAuth ?? false,
  )
}
