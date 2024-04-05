import { FlowRunResponse, FlowRunStatus, PauseType, isNil } from '@linkerry/shared'
import { HttpStatus, Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Redis } from 'ioredis'
import { generateId } from '../../../lib/mongodb'

const listeners = new Map<string, (flowResponse: FlowResponse) => void>()

type FlowResponse = {
	status: number
	body: unknown
	headers: Record<string, string>
}

type FlowResponseWithId = {
	flowRunId: string
	flowResponse: FlowResponse
}

const HANDLER_ID = generateId().toString()

@Injectable()
export class FlowRunWatcherService implements OnApplicationBootstrap {
	private readonly logger = new Logger(FlowRunWatcherService.name)
	private readonly WEBHOOK_TIMEOUT_MS
	private publisher: Redis
	private subscriber: Redis

	constructor(
		// @InjectRedis(REDIS_CLIENT_NAMESPACE.PUBLISHER) private readonly redisPublisher: Redis,
		// @InjectRedis(REDIS_CLIENT_NAMESPACE.SUBSCRIBER) private readonly redisSubscriber: Redis,
		private readonly configService: ConfigService,
	) {
		this.WEBHOOK_TIMEOUT_MS = (+configService.get('WEBHOOK_TIMEOUT_SECONDS') ?? 30) * 1000
		this.publisher = new Redis({
			host: configService.getOrThrow('REDIS_HOST'),
			port: +configService.get('REDIS_PORT'),
			password: configService.get('REDIS_PASSWORD'),
		})
		this.subscriber = new Redis({
			host: configService.getOrThrow('REDIS_HOST'),
			port: +configService.get('REDIS_PORT'),
			password: configService.get('REDIS_PASSWORD'),
		})
	}

	async onApplicationBootstrap() {
		// await this.redisSubscriber.subscribe(`flow-run:sync:${HANDLER_ID}`, (_channel, message: any) => {
		// 	const parsedMessasge: FlowResponseWithId = JSON.parse(message)
		// 	const listener = listeners.get(parsedMessasge.flowRunId)
		// 	if (listener) {
		// 		listener(parsedMessasge.flowResponse)
		// 		listeners.delete(parsedMessasge.flowRunId)
		// 	}
		// 	this.logger.debug(`#init message=${parsedMessasge.flowRunId}`)
		// })
		// await this.redisSubscriber.subscribe(`test`)
		// this.redisSubscriber.subscribe(`message`, (message: any) => {
		// 	const parsedMessasge: FlowResponseWithId = JSON.parse(message)
		// 	const listener = listeners.get(parsedMessasge.flowRunId)
		// 	if (listener) {
		// 		listener(parsedMessasge.flowResponse)
		// 		listeners.delete(parsedMessasge.flowRunId)
		// 	}
		// 	this.logger.debug(`#init message=${parsedMessasge.flowRunId}`)
		// })

		await this.subscriber.subscribe(`flow-run:sync:${HANDLER_ID}`)
		this.subscriber.on(`message`, (_channel: string, message: any) => {
			if (isNil(message)) return
			const parsedMessasge: FlowResponseWithId = JSON.parse(message)
			const listener = listeners.get(parsedMessasge.flowRunId)
			if (listener) {
				listener(parsedMessasge.flowResponse)
				listeners.delete(parsedMessasge.flowRunId)
			}
			this.logger.debug(`#flow-run:sync message=${parsedMessasge.flowRunId}`)
		})
	}

	getHandlerId(): string {
		return HANDLER_ID
	}

	async listen(flowRunId: string, timeoutRequest: boolean): Promise<FlowResponse> {
		this.logger.debug(`#listen flowRunId=${flowRunId}`)
		return new Promise((resolve) => {
			const defaultResponse: FlowResponse = {
				status: HttpStatus.NO_CONTENT,
				body: {},
				headers: {},
			}
			const responseHandler = (flowResponse: FlowResponse) => {
				clearTimeout(timeout)
				resolve(flowResponse)
			}
			let timeout: NodeJS.Timeout
			if (!timeoutRequest) {
				listeners.set(flowRunId, resolve)
			} else {
				timeout = setTimeout(() => {
					resolve(defaultResponse)
				}, this.WEBHOOK_TIMEOUT_MS)
				listeners.set(flowRunId, responseHandler)
			}
		})
	}

	async publish(flowRunId: string, handlerId: string, result: FlowRunResponse): Promise<void> {
		this.logger.debug(`#publish flowRunId=${flowRunId}`)
		const flowResponse = await this.getFlowResponse(result)
		const message: FlowResponseWithId = { flowRunId, flowResponse }
		await this.publisher.publish(`flow-run:sync:${handlerId}`, JSON.stringify(message))
	}

	async getFlowResponse(result: FlowRunResponse): Promise<FlowResponse> {
		switch (result.status) {
			case FlowRunStatus.PAUSED:
				if (result.pauseMetadata && result.pauseMetadata.type === PauseType.WEBHOOK) {
					return {
						status: HttpStatus.OK,
						body: result.pauseMetadata.response,
						headers: {},
					}
				}
				return {
					status: HttpStatus.NO_CONTENT,
					body: {},
					headers: {},
				}
			case FlowRunStatus.STOPPED:
				return {
					status: result.stopResponse?.status ?? HttpStatus.OK,
					body: result.stopResponse?.body,
					headers: result.stopResponse?.headers ?? {},
				}
			case FlowRunStatus.INTERNAL_ERROR:
				return {
					status: HttpStatus.INTERNAL_SERVER_ERROR,
					body: {
						message: 'An internal error has occurred',
					},
					headers: {},
				}
			case FlowRunStatus.FAILED:
				return {
					status: HttpStatus.INTERNAL_SERVER_ERROR,
					body: {
						message: 'The flow has failed and there is no response returned',
					},
					headers: {},
				}
			case FlowRunStatus.TIMEOUT:
			case FlowRunStatus.RUNNING:
				return {
					status: HttpStatus.GATEWAY_TIMEOUT,
					body: {
						message: 'The request took too long to reply',
					},
					headers: {},
				}
			case FlowRunStatus.SUCCEEDED:
			case FlowRunStatus.QUOTA_EXCEEDED:
				return {
					status: HttpStatus.NO_CONTENT,
					body: {},
					headers: {},
				}
		}
	}
}
