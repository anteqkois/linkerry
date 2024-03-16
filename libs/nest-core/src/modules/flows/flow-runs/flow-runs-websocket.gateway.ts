import { Cookies, FlowRunWSInput, WEBSOCKET_EVENT, parseCookieString } from '@linkerry/shared'
import { Logger, UseGuards } from '@nestjs/common'
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { JwtCookiesWebsocketAuthGuard } from '../../../lib/auth/guards/jwt-cookies-websocket-auth.guard'
import { AuthService } from '../../users/auth/auth.service'
import { FlowRunWatcherService } from './flow-runs-watcher.service'
import { FlowRunsService } from './flow-runs.service'

@WebSocketGateway({
	cors: {
		origin: [process.env['FRONTEND_HOST']],
		credentials: true,
	},
	withCredentials: true,
	cookie: true,
	connectTimeout: 10_000,
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
	@SubscribeMessage(WEBSOCKET_EVENT.TEST_FLOW)
	async handleTestFlowEvent(@ConnectedSocket() client: Socket, @MessageBody() data: FlowRunWSInput) {
		const flowRun = await this.flowRunsService.test({
			projectId: data.projectId,
			flowVersionId: data.flowVersionId,
		})
		client.emit(WEBSOCKET_EVENT.TEST_FLOW_STARTED, flowRun)

		await this.flowResponseService.listen(flowRun._id, false)
		client.emit(WEBSOCKET_EVENT.TEST_FLOW_FINISHED, flowRun)
	}
}
