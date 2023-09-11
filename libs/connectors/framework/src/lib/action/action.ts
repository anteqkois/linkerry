import { ActionContext } from '../context'
import { ConnectorAuthProperty, ConnectorPropertyMap, } from '../property'

export type ActionRunner<ConnectorAuth extends ConnectorAuthProperty, ActionProps extends ConnectorPropertyMap> =
  (ctx: ActionContext<ConnectorAuth, ActionProps>) => Promise<unknown | void>

export interface ActionProps extends ConnectorPropertyMap {}

export class ActionInstance<ConnectorAuth extends ConnectorAuthProperty, ActionProps extends ConnectorPropertyMap> {
  constructor(
    public readonly name: string,
    public readonly displayName: string,
    public readonly description: string,
    public readonly props: ActionProps,
    public readonly run: ActionRunner<ConnectorAuth, ActionProps>,
    public readonly requireAuth: boolean,
  ) {}
}

export type Action<
  ConnectorAuth extends ConnectorAuthProperty = any,
  ActionProps extends ConnectorPropertyMap = any,
> = ActionInstance<ConnectorAuth, ActionProps>

export const createAction = (props: ConstructorParameters<typeof ActionInstance>) => {
  return new ActionInstance(...props)
}
