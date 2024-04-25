import { TriggerStrategy, TriggerTestStrategy } from '@linkerry/shared'
import { TriggerHookContext } from '../context'
import { TriggerBase } from '../metadata'
import { ConnectorAuthProperty, ConnectorPropertyMap } from '../property'

export const DEDUPE_KEY_PROPERTY = '_dedupe_key'

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

export enum WebhookRenewStrategy {
	CRON = 'CRON',
	NONE = 'NONE',
}

export type WebhookRenewConfiguration =
	| {
			strategy: WebhookRenewStrategy.CRON
			cronExpression: string
	  }
	| {
			strategy: WebhookRenewStrategy.NONE
	  }

export type TestOrRunHookContext<
	ConnectorAuth extends ConnectorAuthProperty,
	TriggerProps extends ConnectorPropertyMap,
	S extends TriggerStrategy,
> = TriggerHookContext<ConnectorAuth, TriggerProps, S> & {
	// TODO add file service
	// files: FilesService
}

export interface WebhookResponse {
	status: number
	body?: any
	headers?: Record<string, string>
}

export interface TriggerContext {}

export interface TriggerProps extends ConnectorPropertyMap {}

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
		public readonly onHandshake: (ctx: TriggerHookContext<ConnectorAuth, TriggerProps, TS>) => Promise<WebhookResponse>,
		public readonly renewConfiguration: WebhookRenewConfiguration,
		public readonly onRenew: (ctx: TriggerHookContext<ConnectorAuth, TriggerProps, TS>) => Promise<void>,
		public readonly onEnable: (ctx: TriggerHookContext<ConnectorAuth, TriggerProps, TS>) => Promise<void>,
		public readonly onDisable: (ctx: TriggerHookContext<ConnectorAuth, TriggerProps, TS>) => Promise<void>,
		public readonly run: (ctx: TriggerHookContext<ConnectorAuth, TriggerProps, TS>) => Promise<unknown[]>,
		public readonly test: (ctx: TriggerHookContext<ConnectorAuth, TriggerProps, TS>) => Promise<unknown[]>,
		// TODO in ap was removed requireAuth -> check and remove if unecessary
		public readonly requireAuth: boolean,
		public sampleData: unknown,
		public readonly testStrategy: TriggerTestStrategy,
	) {}
}

export type Trigger<
	ConnectorAuth extends ConnectorAuthProperty = any,
	TriggerProps extends ConnectorPropertyMap = any,
	S extends TriggerStrategy = TriggerStrategy,
> = TriggerInstance<S, ConnectorAuth, TriggerProps>

type BaseTriggerParams<TS extends TriggerStrategy, ConnectorAuth extends ConnectorAuthProperty, TriggerProps extends ConnectorPropertyMap> = {
	name: string
	displayName: string
	description: string
	props: TriggerProps
	type: TS
	auth?: ConnectorAuth
	onEnable: (context: TriggerHookContext<ConnectorAuth, TriggerProps, TS>) => Promise<void>
	onDisable: (context: TriggerHookContext<ConnectorAuth, TriggerProps, TS>) => Promise<void>
	run: (context: TestOrRunHookContext<ConnectorAuth, TriggerProps, TS>) => Promise<unknown[]>
	test?: (context: TriggerHookContext<ConnectorAuth, TriggerProps, TS>) => Promise<unknown[]>
	requireAuth?: boolean
	sampleData?: unknown
}

type WebhookTriggerParams<
	TS extends TriggerStrategy,
	ConnectorAuth extends ConnectorAuthProperty,
	TriggerProps extends ConnectorPropertyMap,
> = BaseTriggerParams<TS, ConnectorAuth, TriggerProps> & {
	handshakeConfiguration?: WebhookHandshakeConfiguration
	onHandshake?: (context: TriggerHookContext<ConnectorAuth, TriggerProps, TS>) => Promise<WebhookResponse>
	renewConfiguration?: WebhookRenewConfiguration
	onRenew?(context: TriggerHookContext<ConnectorAuth, TriggerProps, TS>): Promise<void>
}

type CreateTriggerParams<
	TS extends TriggerStrategy,
	ConnectorAuth extends ConnectorAuthProperty,
	TriggerProps extends ConnectorPropertyMap,
> = TS extends TriggerStrategy.WEBHOOK ? WebhookTriggerParams<TS, ConnectorAuth, TriggerProps> : BaseTriggerParams<TS, ConnectorAuth, TriggerProps>

export const createTrigger = <TS extends TriggerStrategy, ConnectorAuth extends ConnectorAuthProperty, TriggerProps extends ConnectorPropertyMap>(
	params: CreateTriggerParams<TS, ConnectorAuth, TriggerProps>,
) => {
	switch (params.type) {
		case TriggerStrategy.WEBHOOK:
			return new TriggerInstance(
				params.name,
				params.displayName,
				params.description,
				params.props,
				params.type,
				params.handshakeConfiguration ?? { strategy: WebhookHandshakeStrategy.NONE },
				params.onHandshake ?? (async () => ({ status: 200 })),
				params.renewConfiguration ?? { strategy: WebhookRenewStrategy.NONE },
				params.onRenew ?? (async () => Promise.resolve()),
				params.onEnable,
				params.onDisable,
				params.run,
				params.test ?? (() => Promise.resolve([params.sampleData])),
				typeof params.requireAuth === 'boolean' ? params.requireAuth : true,
				params.sampleData,
				params.test ? TriggerTestStrategy.TEST_FUNCTION : TriggerTestStrategy.SIMULATION,
			)
		case TriggerStrategy.POLLING:
			return new TriggerInstance(
				params.name,
				params.displayName,
				params.description,
				params.props,
				params.type,
				{ strategy: WebhookHandshakeStrategy.NONE },
				async () => ({ status: 200 }),
				{ strategy: WebhookRenewStrategy.NONE },
				async () => Promise.resolve(),
				params.onEnable,
				params.onDisable,
				params.run,
				params.test ?? (() => Promise.resolve([params.sampleData])),
				typeof params.requireAuth === 'boolean' ? params.requireAuth : true,
				params.sampleData,
				TriggerTestStrategy.TEST_FUNCTION,
			)
		case TriggerStrategy.APP_WEBHOOK:
			return new TriggerInstance(
				params.name,
				params.displayName,
				params.description,
				params.props,
				params.type,
				{ strategy: WebhookHandshakeStrategy.NONE },
				async () => ({ status: 200 }),
				{ strategy: WebhookRenewStrategy.NONE },
				async () => Promise.resolve(),
				params.onEnable,
				params.onDisable,
				params.run,
				params.test ?? (() => Promise.resolve([params.sampleData])),
				typeof params.requireAuth === 'boolean' ? params.requireAuth : true,
				params.sampleData,
				TriggerTestStrategy.TEST_FUNCTION,
			)
	}
}
