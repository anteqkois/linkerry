import { TriggerHookContext } from '../context'
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

export interface TestOrRunHookContext {}

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

export class TriggerInstance<TS extends TriggerStrategy, ConnectorAuth extends ConnectorAuthProperty, TriggerProps extends ConnectorPropertyMap> {
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
    public readonly run: (ctx: TestOrRunHookContext) => Promise<unknown[]>,
    public readonly test: (ctx: TestOrRunHookContext) => Promise<unknown[]>,
    public readonly requireAuth: boolean,
    public sampleData: unknown,
  ) {}
}

export type Trigger<
  ConnectorAuth extends ConnectorAuthProperty = any,
  TriggerProps extends ConnectorPropertyMap = any,
  S extends TriggerStrategy = TriggerStrategy,
> = TriggerInstance<S, ConnectorAuth, TriggerProps>


// type CreateTriggerParams<
//   PieceAuth extends PieceAuthProperty,
//   TriggerProps extends NonAuthPiecePropertyMap,
//   TS extends TriggerStrategy,
// > = {
//   /**
//    * A dummy parameter used to infer {@code PieceAuth} type
//    */
//   name: string
//   displayName: string
//   description: string
//   auth?: PieceAuth
//   props: TriggerProps
//   type: TS
//   handshakeConfiguration?: WebhookHandshakeConfiguration,
//   onEnable: (context: TriggerHookContext<PieceAuth, TriggerProps, TS>) => Promise<void>
//   onHandshake?: (context: TriggerHookContext<PieceAuth, TriggerProps, TS>) => Promise<WebhookResponse>
//   onDisable: (context: TriggerHookContext<PieceAuth, TriggerProps, TS>) => Promise<void>
//   run: (context: TestOrRunHookContext<PieceAuth, TriggerProps, TS>) => Promise<unknown[]>
//   test?: (context: TestOrRunHookContext<PieceAuth, TriggerProps, TS>) => Promise<unknown[]>
//   requireAuth?: boolean
//   sampleData: unknown
// }

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
  run: (context: TestOrRunHookContext) => Promise<unknown[]>
  test?: (context: TestOrRunHookContext) => Promise<unknown[]>
  requireAuth?: boolean
  sampleData: unknown
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
