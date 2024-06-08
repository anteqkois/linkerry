import {
  CustomError,
  ErrorCode,
  EventPayload,
  FlowPopulated,
  FlowStatus,
  Id,
  assertNotNullOrUndefined,
  idSchema,
  isNil,
  isQuotaError,
} from '@linkerry/shared'
import { All, Controller, Logger, Request, Response } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { HttpStatusCode } from 'axios'
import { FastifyReply, FastifyRequest } from 'fastify'
import { Model } from 'mongoose'
import { ParamSchema } from '../../lib/nest-utils/decorators/zod/param.decorator'
import { QuerySchema } from '../../lib/nest-utils/decorators/zod/query.decorator'
import { TasksUsageService } from '../billing/usage/tasks/tasks.service'
import { FlowRunWatcherService } from '../flows/flow-runs/flow-runs-watcher.service'
import { FlowsService } from '../flows/flows/flows.service'
import { FlowDocument, FlowModel } from '../flows/flows/schemas/flow.schema'
import { WebhooksService } from './webhooks.service'

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name)

  constructor(
    @InjectModel(FlowModel.name) private readonly flowModel: Model<FlowDocument>,
    private readonly webhooksService: WebhooksService,
    private readonly flowRunWatcherService: FlowRunWatcherService,
    private readonly tasksUsageService: TasksUsageService,
    private readonly flowsService: FlowsService,
  ) {}

  // TODO add guard for all types, to get know who post to route, somethinkg like ALL_PRINCIPAL_TYPES
  // @UseGuards(JwtBearerTokenAuthGuard)
  @All(':flowId/sync')
  async sync(@ParamSchema('flowId', idSchema) flowId: Id, @Request() request: FastifyRequest, @Response() response: FastifyReply) {
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

  // @UseGuards(JwtBearerTokenAuthGuard)
  @All(':flowId')
  async handleWebhookParams(@ParamSchema('flowId', idSchema) flowId: Id, @Request() request: FastifyRequest, @Response() response: FastifyReply) {
    const flow = await this.getFlowOrThrow(flowId)
    const payload = await this.webhooksService.convertRequest(request)

    const isHandshake = await this._handshakeHandler(flow.toObject(), payload, false, response)
    if (isHandshake) {
      return
    }
    // this._asyncHandler(payload, flow.toObject()).catch(exceptionHandler.handle)
    try {
      await this._asyncHandler(payload, flow.toObject())
      return response.send({
        success: true,
      })
    } catch (error: any) {
      this.logger.error(`#handleWebhookQuery _asyncHandler failure`, ErrorCode.INTERNAL_SERVER, { error: error?.message })
      return response.send({
        success: false,
      })
    }
  }

  // @UseGuards(JwtBearerTokenAuthGuard)
  @All()
  async handleWebhookQuery(@QuerySchema('flowId', idSchema) flowId: Id, @Request() request: FastifyRequest, @Response() response: FastifyReply) {
    const flow = await this.getFlowOrThrow(flowId)
    const payload = await this.webhooksService.convertRequest(request)

    const isHandshake = await this._handshakeHandler(flow.toObject(), payload, false, response)
    if (isHandshake) {
      return
    }

    // this._asyncHandler(payload, flow.toObject()).catch(exceptionHandler.handle)
    try {
      await this._asyncHandler(payload, flow.toObject())
      return response.send({
        success: true,
      })
    } catch (error: any) {
      this.logger.error(`#handleWebhookQuery _asyncHandler failure`, ErrorCode.INTERNAL_SERVER, { error: error?.message })
      return response.send({
        success: false,
      })
    }
  }

  // @UseGuards(JwtBearerTokenAuthGuard)
  @All(':flowId/simulate')
  async simulate(@ParamSchema('flowId', idSchema) flowId: Id, @Request() request: FastifyRequest, @Response() response: FastifyReply) {
    const flow = await this.getFlowOrThrow(flowId)
    const payload = await this.webhooksService.convertRequest(request)

    const isHandshake = await this._handshakeHandler(flow.toObject(), payload, true, response)
    if (isHandshake) {
      return {
        success: true,
      }
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

    return response.send({
      success: true,
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

    try {
      await this.tasksUsageService.checkTaskLimitAndThrow(flow.projectId.toString())
    } catch (error) {
      if (isQuotaError(error)) {
        this.logger.log(`#getFlowOrThrow removing flow.id=${flow._id}, exceeded tasks limit`)
        await this.flowsService.changeStatus({
          newStatus: FlowStatus.DISABLED,
          id: flow.id,
          projectId: flow.projectId.toString(),
        })
      }
      throw error
    }

    return flow
  }
}
