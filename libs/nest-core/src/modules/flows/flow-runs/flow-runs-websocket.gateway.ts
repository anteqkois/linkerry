import { Cookies, FlowRunWSInput, WEBSOCKET_EVENT, WEBSOCKET_NAMESPACE, parseCookieString } from '@linkerry/shared'
import { Logger, UseFilters, UseGuards } from '@nestjs/common'
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { JwtCookiesWebsocketAuthGuard } from '../../../lib/auth/guards/jwt-cookies-websocket-auth.guard'
import { AllExceptionsWebsocketFilter } from '../../../lib/nest-utils'
import { AuthService } from '../../users/auth/auth.service'
import { FlowRunWatcherService } from './flow-runs-watcher.service'
import { FlowRunsService } from './flow-runs.service'

// TODO add nestia types
@WebSocketGateway({
	cors: {
		origin: [process.env['FRONTEND_HOST']],
		credentials: true,
	},
	withCredentials: true,
	cookie: true,
	connectTimeout: 10_000,
	namespace: WEBSOCKET_NAMESPACE.FLOW_RUNS,
})
export class FlowRunsWebSocketService implements OnGatewayConnection, OnGatewayDisconnect {
	// @WebSocketServer()
	// server: Server;
	private readonly logger = new Logger(FlowRunsWebSocketService.name)

	constructor(
		private readonly flowRunsService: FlowRunsService,
		private authService: AuthService,
		private readonly flowResponseService: FlowRunWatcherService,
	) {}

	handleConnection(client: Socket, ...args: any[]): void | Socket {
		if (typeof client.handshake.headers.cookie !== 'string') return client.disconnect(true)

		const jwtPayload = this.authService.verifyJwt(parseCookieString(client.handshake.headers.cookie)[Cookies.ACCESS_TOKEN])
		if (!jwtPayload) return client.disconnect(true)

		this.logger.log(`#handleConnection ${client.id}`)
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`#handleDisconnect ${client.id}`)
	}

	@UseGuards(JwtCookiesWebsocketAuthGuard)
	@UseFilters(new AllExceptionsWebsocketFilter())
	@SubscribeMessage(WEBSOCKET_EVENT.TEST_FLOW)
	async handleTestFlowEvent(@ConnectedSocket() client: Socket, @MessageBody() data: FlowRunWSInput) {
		const flowRun = await this.flowRunsService.test({
			projectId: data.projectId,
			flowVersionId: data.flowVersionId,
		})
		client.emit(WEBSOCKET_EVENT.TEST_FLOW_STARTED, flowRun)

		await this.flowResponseService.listen(flowRun._id.toString(), false)
		client.emit(WEBSOCKET_EVENT.TEST_FLOW_FINISHED, flowRun)
	}
}
