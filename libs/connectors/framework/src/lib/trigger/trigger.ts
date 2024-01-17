import { TriggerHookContext } from '../context'
import { TriggerBase } from '../metadata'
import { ConnectorAuthProperty, ConnectorPropertyMap } from '../property'

export enum WebhookHandshakeStrategy {
  NONE = 'NONE',
  HEADER_PRESENT = 'HEADER_PRESENT',
  QUERY_PRESENT = 'QUERY_PRESENT',
  BODY_PARAM_PRESENT = 'BODY_PARAM_PRESENT',
}

export interface WebhookHandshakeConfiguration {
  strategy: WebhookHandshakeStrategy
  paramName?: string
}

// export interface TestOrRunHookContext {}
export type TestOrRunHookContext<
  ConnectorAuth extends ConnectorAuthProperty,
  TriggerProps extends ConnectorPropertyMap,
  S extends TriggerStrategy,
> = TriggerHookContext<ConnectorAuth, TriggerProps, S> & {
  // todo add file service
  // files: FilesService
}

export interface WebhookResponse {
  status: number
  body?: any
  headers?: Record<string, string>
}

export interface TriggerContext {}

export interface TriggerProps extends ConnectorPropertyMap {}

export enum TriggerStrategy {
  POLLING = 'POLLING',
  WEBHOOK = 'WEBHOOK',
  APP_WEBHOOK = 'APP_WEBHOOK',
}

export class TriggerInstance<TS extends TriggerStrategy, ConnectorAuth extends ConnectorAuthProperty, TriggerProps extends ConnectorPropertyMap>
  implements TriggerBase
{
  constructor(
    public readonly name: string,
    public readonly displayName: string,
    public readonly description: string,
    public readonly props: TriggerProps,
    public readonly type: TS,
    public readonly handshakeConfiguration: WebhookHandshakeConfiguration,
    public readonly onEnable: (ctx: TriggerHookContext<ConnectorAuth, TriggerProps, TS>) => Promise<void>,
    public readonly onHandshake: (ctx: TriggerHookContext<ConnectorAuth, TriggerProps, TS>) => Promise<WebhookResponse>,
    public readonly onDisable: (ctx: TriggerHookContext<ConnectorAuth, TriggerProps, TS>) => Promise<void>,
    public readonly run: (ctx: TriggerHookContext<ConnectorAuth, TriggerProps, TS>) => Promise<unknown[]>,
    public readonly test: (ctx: TriggerHookContext<ConnectorAuth, TriggerProps, TS>) => Promise<unknown[]>,
    public readonly requireAuth: boolean,
    public sampleData: unknown,
  ) {}
}

export type Trigger<
  ConnectorAuth extends ConnectorAuthProperty = any,
  TriggerProps extends ConnectorPropertyMap = any,
  S extends TriggerStrategy = TriggerStrategy,
> = TriggerInstance<S, ConnectorAuth, TriggerProps>

type CreateTriggerParams<TS extends TriggerStrategy, ConnectorAuth extends ConnectorAuthProperty, TriggerProps extends ConnectorPropertyMap> = {
  name: string
  displayName: string
  description: string
  props: TriggerProps
  type: TS
  auth?: ConnectorAuth
  handshakeConfiguration?: WebhookHandshakeConfiguration
  onEnable: (context: TriggerHookContext<ConnectorAuth, TriggerProps, TS>) => Promise<void>
  onHandshake?: (context: TriggerHookContext<ConnectorAuth, TriggerProps, TS>) => Promise<WebhookResponse>
  onDisable: (context: TriggerHookContext<ConnectorAuth, TriggerProps, TS>) => Promise<void>
  // run: (context: TestOrRunHookContext) => Promise<unknown[]>
  run: (context: TestOrRunHookContext<ConnectorAuth, TriggerProps, TS>) => Promise<unknown[]>
  test?: (context: TriggerHookContext<ConnectorAuth, TriggerProps, TS>) => Promise<unknown[]>
  requireAuth?: boolean
  sampleData?: unknown
}

export const createTrigger = <TS extends TriggerStrategy, ConnectorAuth extends ConnectorAuthProperty, TriggerProps extends ConnectorPropertyMap>(
  params: CreateTriggerParams<TS, ConnectorAuth, TriggerProps>,
) => {
  return new TriggerInstance(
    params.name,
    params.displayName,
    params.description,
    params.props,
    params.type,
    params.handshakeConfiguration ?? { strategy: WebhookHandshakeStrategy.NONE },
    params.onEnable,
    params.onHandshake ?? (async () => ({ status: 200 })),
    params.onDisable,
    params.run,
    params.test ?? (() => Promise.resolve([params.sampleData])),
    params.requireAuth ?? false,
    params.sampleData,
  )
}
