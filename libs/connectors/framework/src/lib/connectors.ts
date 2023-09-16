import { Action } from './action/action'
import { ConnectorAuthProperty } from './property'
import { Trigger } from './trigger/trigger'

export class Connector<ConnectorAuth extends ConnectorAuthProperty = ConnectorAuthProperty> {
  private readonly _actions: Record<string, Action> = {}
  private readonly _triggers: Record<string, Trigger> = {}

  constructor(
    public readonly name: string,
    public readonly displayName: string,
    public readonly logoUrl: string,
    public readonly description: string,
    triggers: Trigger<ConnectorAuth>[],
    actions: Action<ConnectorAuth>[],
    public readonly requiredAith: boolean,
    public readonly auth?: ConnectorAuth,
  ) {
    actions.forEach((action) => (this._actions[action.name] = action))
    triggers.forEach((trigger) => (this._triggers[trigger.name] = trigger))
  }

  metadata() {
    return {
      displayName: this.displayName,
      name: this.name,
      description: this.description,
      logoUrl: this.logoUrl,
      actions: this._actions,
      triggers: this._triggers,
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

type CreateConnectorParams<ConnectorAuth extends ConnectorAuthProperty = ConnectorAuthProperty> = {
  name: string
  displayName: string
  logoUrl: string
  description: string
  auth: ConnectorAuth | undefined
  requiredAuth?: boolean
  // events?: ConnectorEventProcessors
  // minimumSupportedRelease?: string
  // maximumSupportedRelease?: string
  actions: Action<ConnectorAuth>[]
  triggers: Trigger<ConnectorAuth>[]
}

export const createConnector = <ConnectorAuth extends ConnectorAuthProperty>(params: CreateConnectorParams<ConnectorAuth>) => {
  return new Connector(
    params.name,
    params.displayName,
    params.logoUrl,
    params.description,
    params.triggers,
    params.actions,
    params.requiredAuth ?? false,
    params.auth,
  )
}
