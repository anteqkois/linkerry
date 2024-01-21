import { Action } from './action/action'
import { ConnectorBase } from './metadata'
import { ConnectorAuthProperty } from './property'
import { ConnectorTag } from './tags'
import { Trigger } from './trigger/trigger'

export class Connector<ConnectorAuth extends ConnectorAuthProperty = ConnectorAuthProperty>
  implements Omit<ConnectorBase, 'version' | 'name' | 'minimumSupportedRelease' | 'maximumSupportedRelease' | '_id'>
{
  private readonly _actions: Record<string, Action> = {}
  private readonly _triggers: Record<string, Trigger> = {}

  constructor(
    public readonly name: string,
    public readonly displayName: string,
    public readonly logoUrl: string,
    public readonly description: string,
    public readonly minimumSupportedRelease: string,
    public readonly maximumSupportedRelease: string,
    public readonly tags: ConnectorTag[],
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
      minimumSupportedRelease: this.minimumSupportedRelease,
      maximumSupportedRelease: this.maximumSupportedRelease,
      tags: this.tags,
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
  minimumSupportedRelease: string
  maximumSupportedRelease?: string
  auth: ConnectorAuth | undefined
  requiredAuth?: boolean
  // events?: ConnectorEventProcessors
  actions: Action<ConnectorAuth>[]
  triggers: Trigger<ConnectorAuth>[]
  tags: ConnectorTag[]
}

export const createConnector = <ConnectorAuth extends ConnectorAuthProperty>(params: CreateConnectorParams<ConnectorAuth>) => {
  return new Connector(
    params.name,
    params.displayName,
    params.logoUrl,
    params.description,
    params.minimumSupportedRelease,
    params.maximumSupportedRelease ?? '9999.9999.9999',
    params.tags,
    params.triggers,
    params.actions,
    params.requiredAuth ?? false,
    params.auth,
  )
}
