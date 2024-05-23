import { AppConnectionValue, ExecutionType, Id, PauseMetadata, StopResponse, TriggerStrategy } from '@linkerry/shared'
import { ConnectorAuthProperty, ConnectorPropValueSchema, ConnectorPropertyMap, StaticPropsValue } from './property'

type BaseContext<ConnectorAuth extends ConnectorAuthProperty, Props extends ConnectorPropertyMap> = {
  auth: ConnectorPropValueSchema<ConnectorAuth>
  propsValue: StaticPropsValue<Props>
  store: Store
  project: {
    id: Id
    // externalId: () => Promise<string | undefined>;
  }
}

export type TriggerPayload =
  | Record<string, never>
  | {
      body: any
      headers: Record<string, string>
      queryParams: Record<string, string>
    }

type AppWebhookTriggerHookContext<ConnectorAuth extends ConnectorAuthProperty, TriggerProps extends ConnectorPropertyMap> = BaseContext<
  ConnectorAuth,
  TriggerProps
> & {
  webhookUrl: string
  payload: TriggerPayload
  app: {
    createListeners({ events, identifierValue }: { events: string[]; identifierValue: string }): Promise<void>
  }
}

type PollingTriggerHookContext<ConnectorAuth extends ConnectorAuthProperty, TriggerProps extends ConnectorPropertyMap> = BaseContext<
  ConnectorAuth,
  TriggerProps
> & {
  setSchedule(schedule: { cronExpression: string; timezone?: string }): void
}

type WebhookTriggerHookContext<ConnectorAuth extends ConnectorAuthProperty, TriggerProps extends ConnectorPropertyMap> = BaseContext<
  ConnectorAuth,
  TriggerProps
> & {
  webhookUrl: string
  payload: TriggerPayload
}

export type TriggerHookContext<
  ConnectorAuth extends ConnectorAuthProperty,
  TriggerProps extends ConnectorPropertyMap,
  S extends TriggerStrategy,
> = S extends TriggerStrategy.APP_WEBHOOK
  ? AppWebhookTriggerHookContext<ConnectorAuth, TriggerProps>
  : S extends TriggerStrategy.POLLING
  ? PollingTriggerHookContext<ConnectorAuth, TriggerProps>
  : S extends TriggerStrategy.WEBHOOK
  ? WebhookTriggerHookContext<ConnectorAuth, TriggerProps>
  : never

export type StopHookParams = {
  response: StopResponse
}

export type StopHook = (params: StopHookParams) => void

type PauseMetadataWithoutResumeStepMetadata<T extends PauseMetadata> = T extends PauseMetadata ? Omit<T, 'resumeStepMetadata'> : never

export type PauseHookPauseMetadata = PauseMetadataWithoutResumeStepMetadata<PauseMetadata>

export type PauseHookParams = {
  pauseMetadata: PauseHookPauseMetadata
}

export type PauseHook = (params: PauseHookParams) => void

export type BaseActionContext<
  ET extends ExecutionType,
  ConnectorAuth extends ConnectorAuthProperty,
  ActionProps extends ConnectorPropertyMap,
> = BaseContext<ConnectorAuth, ActionProps> & {
  executionType: ET
  connections: ConnectionsManager
  tags: TagsManager
  server: ServerContext
  files: FilesService
  serverUrl: string
  run: {
    id: Id
    stop: StopHook
    pause: PauseHook
  }
  generateResumeUrl: (params: { queryParams: Record<string, string> }) => string
}

type BeginExecutionActionContext<ConnectorAuth extends ConnectorAuthProperty, ActionProps extends ConnectorPropertyMap> = BaseActionContext<
  ExecutionType.BEGIN,
  ConnectorAuth,
  ActionProps
>

type ResumeExecutionActionContext<ConnectorAuth extends ConnectorAuthProperty, ActionProps extends ConnectorPropertyMap> = BaseActionContext<
  ExecutionType.RESUME,
  ConnectorAuth,
  ActionProps
> & {
  resumePayload: unknown
}

export type ActionContext<
  ConnectorAuth extends ConnectorAuthProperty = ConnectorAuthProperty,
  ActionProps extends ConnectorPropertyMap = ConnectorPropertyMap,
> = BeginExecutionActionContext<ConnectorAuth, ActionProps> | ResumeExecutionActionContext<ConnectorAuth, ActionProps>

export interface ConnectionsManager {
  get(key: string): Promise<AppConnectionValue | Record<string, unknown> | string | null>
}

export interface TagsManager {
  add(params: { name: string }): Promise<void>
}

export interface FilesService {
  write({ fileName, data }: { fileName: string; data: Buffer }): Promise<string>
}

export interface Store {
  put<T>(key: string, value: T, scope?: StoreScope): Promise<T>
  get<T>(key: string, scope?: StoreScope): Promise<T | null>
  delete(key: string, scope?: StoreScope): Promise<void>
}

export enum StoreScope {
  PROJECT = 'PROJECT',
  FLOW = 'FLOW',
}

export type PropertyContext = {
  server: ServerContext
  project: {
    id: Id
    // externalId: () => Promise<string | undefined>;
  }
  searchValue?: string
}

export type ServerContext = {
  apiUrl: string
  publicUrl: string
  token: string
}
