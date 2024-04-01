import { CustomError, ErrorCode, EventPayload, FlowPopulated, Id, assertNotNullOrUndefined, isNil } from '@linkerry/shared'
import { All, Controller, Logger, Param, Request, Response, UseGuards } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { HttpStatusCode } from 'axios'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Model } from 'mongoose'
import { JwtBearerTokenAuthGuard } from '../../lib/auth'
import { FlowRunWatcherService } from '../flows/flow-runs/flow-runs-watcher.service'
import { FlowDocument, FlowModel } from '../flows/flows/schemas/flow.schema'
import { WebhooksService } from './webhooks.service'

@Controller('webhooks')
export class WebhooksController {
	private readonly logger = new Logger(WebhooksController.name)

	constructor(
		@InjectModel(FlowModel.name) private readonly flowModel: Model<FlowDocument>,
		private readonly webhooksService: WebhooksService,
		private readonly flowRunWatcherService: FlowRunWatcherService,
	) {}

	@UseGuards(JwtBearerTokenAuthGuard)
	@All(':flowId/sync')
	async sync(@Param('flowId') flowId: Id, @Request() request: FastifyRequest, @Response() response: FastifyReply) {
		const flow = await this.getFlowOrThrow(flowId)
		const payload = await this.webhooksService.convertRequest(request)

		const isHandshake = await this._handshakeHandler(flow.toObject(), payload, false, response)
		if (isHandshake) {
			return
		}
		const run = (
			await this.webhooksService.callback({
				flow: flow.toObject(),
				synchronousHandlerId: this.flowRunWatcherService.getHandlerId(),
				payload: {
					method: request.method,
					headers: request.headers as Record<string, string>,
					body: await this.webhooksService.convertBody(request),
					queryParams: request.query as Record<string, string>,
				},
			})
		)[0]
		if (isNil(run)) {
			await response.status(HttpStatusCode.NotFound).send()
			return
		}
		const flowWatcherResponse = await this.flowRunWatcherService.listen(run.id, true)
		await response.status(flowWatcherResponse.status).headers(flowWatcherResponse.headers).send(flowWatcherResponse.body)
	}

	@UseGuards(JwtBearerTokenAuthGuard)
	@All(':flowId/sync')
	async handshake(@Param('flowId') flowId: Id, @Request() request: FastifyRequest, @Response() response: FastifyReply) {
		const flow = await this.getFlowOrThrow(flowId)
		const payload = await this.webhooksService.convertRequest(request)

		const isHandshake = await this._handshakeHandler(flow.toObject(), payload, false, response)
		if (isHandshake) {
			return
		}
		// this._asyncHandler(payload, flow.toObject()).catch(exceptionHandler.handle)
		this._asyncHandler(payload, flow.toObject()).catch((error) => {
			this.logger.error(`#handshake _asyncHandler failure`, ErrorCode.INTERNAL_SERVER, { error: error?.message })
		})
	}

	@UseGuards(JwtBearerTokenAuthGuard)
	@All(':flowId/simulate')
	async simulate(@Param('flowId') flowId: Id, @Request() request: FastifyRequest, @Response() response: FastifyReply) {
		const flow = await this.getFlowOrThrow(flowId)
		const payload = await this.webhooksService.convertRequest(request)

		const isHandshake = await this._handshakeHandler(flow.toObject(), payload, false, response)
		if (isHandshake) {
			return
		}

		await this.webhooksService.simulationCallback({
			flow: flow.toObject(),
			payload: {
				method: request.method,
				headers: request.headers as Record<string, string>,
				body: await this.webhooksService.convertBody(request),
				queryParams: request.query as Record<string, string>,
			},
		})
	}

	private async _handshakeHandler(flow: FlowPopulated, payload: EventPayload, simulate: boolean, response: FastifyReply): Promise<boolean> {
		const handshakeResponse = await this.webhooksService.handshake({
			flow,
			payload,
			simulate,
		})

		if (!isNil(handshakeResponse)) {
			response = response.status(handshakeResponse.status)
			if (handshakeResponse.headers !== undefined) {
				for (const header of Object.keys(handshakeResponse.headers)) {
					response = response.header(header, handshakeResponse.headers[header] as string)
				}
			}
			await response.send(handshakeResponse.body)
			return true
		}
		return false
	}

	private async _asyncHandler(payload: EventPayload, flow: FlowPopulated) {
		return this.webhooksService.callback({
			flow,
			payload,
		})
	}

	async getFlowOrThrow(flowId: Id): Promise<FlowDocument<'version'>> {
		if (isNil(flowId)) {
			this.logger.error(`#getFlowOrThrow error=flow_id_is_undefined`)
			throw new CustomError('flowId is undefined', ErrorCode.VALIDATION)
		}

		// const flow = await flowRepo().findOneBy({ id: flowId })
		const flow = await this.flowModel
			.findOne<FlowDocument<'version'>>({
				_id: flowId,
			})
			.populate('version')
		assertNotNullOrUndefined(flow, 'flow')

		if (isNil(flow)) {
			this.logger.error(`#getFlowOrThrow error=flow_not_found flowId=${flowId}`)
			throw new CustomError('flowId not found', ErrorCode.FLOW_NOT_FOUND)
		}

		// TODO implement billing
		// // BEGIN EE
		// const edition = getEdition()
		// if ([ApEdition.CLOUD, ApEdition.ENTERPRISE].includes(edition)) {
		// 	try {
		// 		await tasksLimit.limit({
		// 			projectId: flow.projectId,
		// 		})
		// 	} catch (e) {
		// 		if (e instanceof ActivepiecesError && e.error.code === ErrorCode.QUOTA_EXCEEDED) {
		// 			logger.info(`[webhookController] removing flow.id=${flow.id} run out of flow quota`)
		// 			await flowService.updateStatus({
		// 				id: flow.id,
		// 				projectId: flow.projectId,
		// 				newStatus: FlowStatus.DISABLED,
		// 			})
		// 		}
		// 		throw e
		// 	}
		// }
		// // END EE

		return flow.toObject()
	}

	// TODO implement webhooks handlers
	// /Users/anteqkois/Code/Projects/me/activepieces/packages/server/api/src/app/webhooks/webhook-controller.ts
}
