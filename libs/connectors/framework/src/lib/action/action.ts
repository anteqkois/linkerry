import { ActionContext } from '../context'
import { ActionBase } from '../metadata'
import { ConnectorAuthProperty, ConnectorPropertyMap } from '../property'

export type ActionRunner<ConnectorAuth extends ConnectorAuthProperty, ActionProps extends ConnectorPropertyMap> = (
  ctx: ActionContext<ConnectorAuth, ActionProps>,
) => Promise<unknown | void>

export interface ActionProps extends ConnectorPropertyMap {}

export class ActionInstance<ConnectorAuth extends ConnectorAuthProperty, ActionProps extends ConnectorPropertyMap> implements ActionBase {
  constructor(
    public readonly name: string,
    public readonly displayName: string,
    public readonly description: string,
    public readonly props: ActionProps,
    public readonly run: ActionRunner<ConnectorAuth, ActionProps>,
    public readonly test: ActionRunner<ConnectorAuth, ActionProps>,
    public readonly requireAuth: boolean,
  ) {}
}

export type Action<ConnectorAuth extends ConnectorAuthProperty = any, ActionProps extends ConnectorPropertyMap = any> = ActionInstance<
  ConnectorAuth,
  ActionProps
>

type CreateActionParams<ConnectorAuth extends ConnectorAuthProperty, ActionProps extends ConnectorPropertyMap> = {
  name: string
  displayName: string
  description: string
  props: ActionProps
  run: ActionRunner<ConnectorAuth, ActionProps>
  test?: ActionRunner<ConnectorAuth, ActionProps>
  requireAuth?: boolean
  auth?: ConnectorAuth
}

export const createAction = ({
  description,
  displayName,
  name,
  props,
  run,
  requireAuth,
  test,
}: CreateActionParams<ConnectorAuthProperty, ConnectorPropertyMap>) => {
  return new ActionInstance(name, displayName, description, props, run, test || run, requireAuth || false)
}
