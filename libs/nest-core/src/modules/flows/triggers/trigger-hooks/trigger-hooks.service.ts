import { TriggerBase, TriggerStrategy, WebhookHandshakeStrategy, WebhookResponse } from '@linkerry/connectors-framework'
import { EngineResponseStatus, FlowVersion, RunEnvironment, TriggerConnector, TriggerHookType, TriggerType, isNil } from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EngineHelperResponse, EngineHelperTriggerResult, EngineService } from '../../../engine'
import { WebhooksService } from '../../../webhooks/webhooks.service'
import { JobType, LATEST_JOB_DATA_SCHEMA_VERSION, RepeatableJobType } from '../../../workers/flow-worker/queues'
import { QueuesService } from '../../../workers/flow-worker/queues/queues.service'
import { ConnectorsMetadataService } from '../../connectors'
import { DisableParams, EnableTriggerHookParams, ExecuteHandshakeParams, ExecuteTrigger, RenewWebhookParams } from './types'

@Injectable()
export class TriggerHooks {
	private readonly logger = new Logger(TriggerHooks.name)
	private POLLING_FREQUENCY_CRON_EXPRESSON: string

	constructor(
		private readonly connectorsMetadataService: ConnectorsMetadataService,
		private readonly webhookService: WebhooksService,
		private readonly engineService: EngineService,
		private readonly configService: ConfigService,
		private readonly queuesService: QueuesService,
	) {
		this.POLLING_FREQUENCY_CRON_EXPRESSON = `*/${configService.get('TRIGGER_DEFAULT_POLL_INTERVAL') ?? 5} * * * *`
	}

	private async _sideeffect(connectorTrigger: TriggerBase, projectId: string, flowVersion: FlowVersion): Promise<void> {
		switch (connectorTrigger.type) {
			// case TriggerStrategy.APP_WEBHOOK:
			// 	await appEventRoutingService.deleteListeners({
			// 		projectId,
			// 		flowId: flowVersion.flowId,
			// 	})
			// 	break
			// case TriggerStrategy.WEBHOOK: {
			// 	const renewConfiguration = connectorTrigger.renewConfiguration
			// 	if (renewConfiguration?.strategy === WebhookRenewStrategy.CRON) {
			// 		await flowQueue.removeRepeatingJob({
			// 			id: flowVersion.id,
			// 		})
			// 	}
			// 	break
			// }
			case TriggerStrategy.POLLING:
				await this.queuesService.removeRepeatingJob({
					id: flowVersion._id,
				})
				break
		}
	}

	private async _executeHandshake(params: ExecuteHandshakeParams): Promise<WebhookResponse> {
		const { flowVersion, projectId, payload } = params
		const { result } = await this.engineService.executeTrigger({
			triggerName: params.triggerName,
			hookType: TriggerHookType.HANDSHAKE,
			flowVersion,
			triggerPayload: payload,
			webhookUrl: await this.webhookService.getWebhookUrl({
				flowId: flowVersion.flow,
				simulate: false,
			}),
			projectId,
		})
		if (!result.success || result.response === undefined) {
			return {
				status: 500,
				body: {
					error: 'Failed to execute handshake',
				},
			}
		}
		return result.response
	}

	async tryHandshake(params: ExecuteHandshakeParams): Promise<WebhookResponse | null> {
		const { payload, flowVersion, projectId } = params
		const flowTrigger = flowVersion.triggers[0]
		if (flowTrigger.type === TriggerType.TRIGGER) {
			const connectorTrigger = await this.connectorsMetadataService.getTrigger(flowTrigger.name, flowTrigger.settings.triggerName)
			const handshakeConfig = connectorTrigger.handshakeConfiguration
			if (isNil(handshakeConfig)) {
				return null
			}
			const strategy = handshakeConfig.strategy ?? WebhookHandshakeStrategy.NONE
			switch (strategy) {
				case WebhookHandshakeStrategy.HEADER_PRESENT: {
					if (handshakeConfig.paramName && handshakeConfig.paramName.toLowerCase() in payload.headers) {
						return this._executeHandshake({
							triggerName: flowTrigger.name,
							flowVersion,
							projectId,
							payload,
						})
					}
					break
				}
				case WebhookHandshakeStrategy.QUERY_PRESENT: {
					if (handshakeConfig.paramName && handshakeConfig.paramName in payload.queryParams) {
						return this._executeHandshake({
							triggerName: flowTrigger.name,
							flowVersion,
							projectId,
							payload,
						})
					}
					break
				}
				case WebhookHandshakeStrategy.BODY_PARAM_PRESENT: {
					if (handshakeConfig.paramName && typeof payload.body === 'object' && payload.body !== null && handshakeConfig.paramName in payload.body) {
						return this._executeHandshake({
							triggerName: flowTrigger.name,
							flowVersion,
							projectId,
							payload,
						})
					}
					break
				}
				default:
					break
			}
		}
		return null
	}

	async enable(params: EnableTriggerHookParams): Promise<EngineHelperResponse<EngineHelperTriggerResult<TriggerHookType.ON_ENABLE>> | null> {
		const { flowVersion, projectId, simulate } = params
		if (flowVersion.triggers[0].type !== TriggerType.TRIGGER) {
			return null
		}

		const flowTrigger = flowVersion.triggers[0] as TriggerConnector
		const connectorTrigger = await this.connectorsMetadataService.getTrigger(flowTrigger.settings.connectorName, flowTrigger.settings.triggerName)

		const webhookUrl = await this.webhookService.getWebhookUrl({
			flowId: flowVersion.flow,
			simulate,
		})

		const engineHelperResponse = await this.engineService.executeTrigger({
			hookType: TriggerHookType.ON_ENABLE,
			flowVersion,
			webhookUrl,
			projectId,
			triggerName: connectorTrigger.name,
		})

		if (engineHelperResponse.status !== EngineResponseStatus.OK) return engineHelperResponse

		switch (connectorTrigger.type) {
			// case TriggerStrategy.APP_WEBHOOK: {
			// 		const appName = flowTrigger.settings.pieceName
			// 		for (const listener of engineHelperResponse.result.listeners) {
			// 				await appEventRoutingService.createListeners({
			// 						projectId,
			// 						flowId: flowVersion.flowId,
			// 						appName,
			// 						events: listener.events,
			// 						identifierValue: listener.identifierValue,
			// 				})
			// 		}
			// 		break
			// }
			// case TriggerStrategy.WEBHOOK: {
			// 		const renewConfiguration = pieceTrigger.renewConfiguration
			// 		switch (renewConfiguration?.strategy) {
			// 				case WebhookRenewStrategy.CRON: {
			// 						await flowQueue.add({
			// 								id: flowVersion.id,
			// 								type: JobType.REPEATING,
			// 								data: {
			// 										schemaVersion: LATEST_JOB_DATA_SCHEMA_VERSION,
			// 										projectId,
			// 										flowVersionId: flowVersion.id,
			// 										flowId: flowVersion.flowId,
			// 										jobType: RepeatableJobType.RENEW_WEBHOOK,
			// 								},
			// 								scheduleOptions: {
			// 										cronExpression: renewConfiguration.cronExpression,
			// 										timezone: 'UTC',
			// 								},
			// 						})
			// 						break
			// 				}
			// 				default:
			// 						break
			// 		}
			// 		break
			// }
			case TriggerStrategy.POLLING: {
				if (isNil(engineHelperResponse.result.scheduleOptions)) {
					engineHelperResponse.result.scheduleOptions = {
						cronExpression: this.POLLING_FREQUENCY_CRON_EXPRESSON,
						timezone: 'UTC',
					}
					// // BEGIN EE
					// const edition = getEdition()
					// if (edition === ApEdition.CLOUD) {
					// 	const plan = await plansService.getOrCreateDefaultPlan({
					// 		projectId,
					// 	})
					// 	engineHelperResponse.result.scheduleOptions.cronExpression = constructEveryXMinuteCron(plan.minimumPollingInterval)
					// }
					// // END EE
				}
				await this.queuesService.addToQueue({
					id: flowVersion._id,
					type: JobType.REPEATING,
					data: {
						schemaVersion: LATEST_JOB_DATA_SCHEMA_VERSION,
						projectId,
						environment: RunEnvironment.PRODUCTION,
						flowVersionId: flowVersion._id,
						flowId: flowVersion.flow,
						triggerType: TriggerType.TRIGGER,
						jobType: RepeatableJobType.EXECUTE_TRIGGER,
					},
					scheduleOptions: engineHelperResponse.result.scheduleOptions,
				})

				break
			}
		}

		return engineHelperResponse
	}

	async disable(params: DisableParams): Promise<EngineHelperResponse<EngineHelperTriggerResult<TriggerHookType.ON_DISABLE>> | null> {
		const { flowVersion, projectId, simulate } = params
		if (flowVersion.triggers[0].type !== TriggerType.TRIGGER) {
			return null
		}
		const flowTrigger = flowVersion.triggers[0] as TriggerConnector
		const connectorTrigger = await this.connectorsMetadataService.getTrigger(flowTrigger.settings.connectorName, flowTrigger.settings.triggerName)

		const webhookUrl = await this.webhookService.getWebhookUrl({
			flowId: flowVersion.flow,
			simulate,
		})

		try {
			return await this.engineService.executeTrigger({
				triggerName: connectorTrigger.name,
				hookType: TriggerHookType.ON_DISABLE,
				flowVersion,
				webhookUrl,
				projectId,
			})
		} catch (error) {
			if (!params.ignoreError) {
				throw error
			}
			return null
		} finally {
			await this._sideeffect(connectorTrigger, projectId, flowVersion)
		}
	}

	async executeTrigger(params: ExecuteTrigger): Promise<unknown[]> {
		const { payload, flowVersion, projectId, simulate } = params
		const flowTrigger = flowVersion.triggers[0]
		let payloads: unknown[] = []
		switch (flowTrigger.type) {
			case TriggerType.TRIGGER: {
				const connectorTrigger = await this.connectorsMetadataService.getTrigger(flowTrigger.settings.connectorName, flowTrigger.settings.triggerName)
				const webhookUrl = await this.webhookService.getWebhookUrl({
					flowId: flowVersion.flow,
					simulate,
				})
				const { result } = await this.engineService.executeTrigger({
					triggerName: connectorTrigger.name,
					hookType: TriggerHookType.RUN,
					flowVersion,
					triggerPayload: payload,
					webhookUrl,
					projectId,
				})

				if (result.success && Array.isArray(result.output)) {
					payloads = result.output
				} else {
					this.logger.error(`Flow ${flowTrigger.name} with ${connectorTrigger.name} trigger throws and error, returning as zero payload `, result)
					payloads = []
				}

				break
			}
			default:
				payloads = [payload]
				break
		}
		return payloads as unknown[]
	}

	async renewWebhook(params: RenewWebhookParams): Promise<void> {
		const { flowVersion, projectId, simulate } = params
		try {
			await this.engineService.executeTrigger({
				triggerName: params.flowVersion.triggers[0].name,
				hookType: TriggerHookType.RENEW,
				flowVersion,
				webhookUrl: await this.webhookService.getWebhookUrl({
					flowId: flowVersion.flow,
					simulate,
				}),
				projectId,
			})
		} catch (error: any) {
			this.logger.error(`Failed to renew webhook for flow ${flowVersion.flow} in project ${projectId}`, error)
		}
	}
}
