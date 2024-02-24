import { ConnectorPropertyMap, StaticPropsValue, TriggerStrategy } from '@linkerry/connectors-framework'
import { ExecuteTriggerOperation, ExecuteTriggerResponse, ScheduleOptions, TriggerConnector, TriggerHookType } from '@linkerry/shared'
import { isValidCron } from 'cron-validator'
import { EngineConstants } from '../handler/context/engine-constants'
import { FlowExecutorContext } from '../handler/context/flow-execution-context'
import { createContextStore } from '../services/storage.service'
import { AUTHENTICATION_PROPERTY_NAME, variableService } from '../services/veriables.service'
import { connectorLoader } from './connector-loader'

type Listener = {
    events: string[]
    identifierValue: string
    identifierKey: string
}

export const triggerHelper = {
    async executeTrigger({ params, constants }: ExecuteTriggerParams): Promise<ExecuteTriggerResponse<TriggerHookType>> {
        const { connectorName, connectorVersion, triggerName, input } = (params.flowVersion.triggers[0] as TriggerConnector).settings

        const connector = await connectorLoader.loadConnectorOrThrow({ connectorName, connectorVersion, connectorSource: constants.connectorSource })
        const trigger = connector.getTrigger(triggerName)

        if (trigger === undefined) {
            throw new Error(`trigger not found, connectorName=${connectorName}, triggerName=${triggerName}`)
        }

        const { resolvedInput } = await variableService({
            projectId: params.projectId,
            workerToken: params.workerToken,
        }).resolve<StaticPropsValue<ConnectorPropertyMap>>({
            unresolvedInput: input,
            executionState: FlowExecutorContext.empty(),
        })

        const { processedInput, errors } = await variableService({
            projectId: params.projectId,
            workerToken: params.workerToken,
        }).applyProcessorsAndValidators(resolvedInput, trigger.props, connector.auth)

        if (Object.keys(errors).length > 0) {
            throw new Error(JSON.stringify(errors))
        }

        const appListeners: Listener[] = []
        const prefix = (params.hookType === TriggerHookType.TEST) ? 'test' : ''
        let scheduleOptions: ScheduleOptions | undefined = undefined
        const context = {
            store: createContextStore({
                prefix,
                flowId: params.flowVersion.flow,
                workerToken: params.workerToken,
            }),
            app: {
                createListeners({ events, identifierKey, identifierValue }: Listener): void {
                    appListeners.push({ events, identifierValue, identifierKey })
                },
            },
            setSchedule(request: ScheduleOptions) {
                if (!isValidCron(request.cronExpression)) {
                    throw new Error(`Invalid cron expression: ${request.cronExpression}`)
                }
                scheduleOptions = {
                    cronExpression: request.cronExpression,
                    timezone: request.timezone ?? 'UTC',
                }
            },
            webhookUrl: params.webhookUrl,
            auth: processedInput[AUTHENTICATION_PROPERTY_NAME],
            propsValue: processedInput,
            payload: params.triggerPayload ?? {},
            project: {
                id: params.projectId,
                // externalId: constants.externalProjectId,
            },
        }
        switch (params.hookType) {
            case TriggerHookType.ON_DISABLE:
                await trigger.onDisable(context)
                return {}
            case TriggerHookType.ON_ENABLE:
                await trigger.onEnable(context)
                return {
                    listeners: appListeners,
                    scheduleOptions: trigger.type === TriggerStrategy.POLLING ? scheduleOptions : undefined,
                }
            case TriggerHookType.HANDSHAKE: {
                try {
                    const response = await trigger.onHandshake(context)
                    return {
                        success: true,
                        response,
                    }
                }
                catch (e) {
                    console.error(e)

                    return {
                        success: false,
                        message: JSON.stringify(e),
                    }
                }
            }
            case TriggerHookType.TEST:
                try {
                    return {
                        success: true,
                        output: await trigger.test({
                            ...context,
                            // files: createFilesService({
                            //     workerToken: params.workerToken,
                            //     stepName: triggerName,
                            //     flowId: params.flowVersion.flow,
                            //     type: 'db',
                            // }),
                        }),
                    }
                }
                catch (e) {
                    console.error(e)

                    return {
                        success: false,
                        message: JSON.stringify(e),
                        output: [],
                    }
                }
            case TriggerHookType.RUN: {
                if (trigger.type === TriggerStrategy.APP_WEBHOOK) {
                    if (!params.appWebhookUrl) {
                        throw new Error(`App webhook url is not avaiable for connector name ${connectorName}`)
                    }
                    if (!params.webhookSecret) {
                        throw new Error(`Webhook secret is not avaiable for connector name ${connectorName}`)
                    }

                    // try {
                    //     const verified = connector.events?.verify({
                    //         appWebhookUrl: params.appWebhookUrl,
                    //         payload: params.triggerPayload as EventPayload,
                    //         webhookSecret: params.webhookSecret,
                    //     })

                    //     if (verified === false) {
                    //         console.info('Webhook is not verified')
                    //         return {
                    //             success: false,
                    //             message: 'Webhook is not verified',
                    //             output: [],
                    //         }
                    //     }
                    // }
                    // catch (e) {
                    //     console.error('Error while verifying webhook', e)
                    //     return {
                    //         success: false,
                    //         message: 'Error while verifying webhook',
                    //         output: [],
                    //     }
                    // }
                }
                const items = await trigger.run({
                    ...context,
                    // files: createFilesService({
                    //     workerToken: params.workerToken,
                    //     flowId: params.flowVersion.flow,
                    //     stepName: triggerName,
                    //     type: 'memory',
                    // }),
                })
                if (!Array.isArray(items)) {
                    throw new Error(`Trigger run should return an array of items, but returned ${typeof items}`)
                }
                return {
                    success: true,
                    output: items,
                }
            }
        }
    },
}

type ExecuteTriggerParams = {
    params: ExecuteTriggerOperation<TriggerHookType>
    constants: EngineConstants
}
