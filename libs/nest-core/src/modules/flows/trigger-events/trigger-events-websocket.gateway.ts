import {
	Cookies,
	RequestUser,
	WEBSOCKET_EVENT,
	WEBSOCKET_NAMESPACE,
	WatchTriggerEventsWSInput,
	parseCookieString
} from '@linkerry/shared'
import { Logger, UseFilters, UseGuards } from '@nestjs/common'
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { JwtCookiesWebsocketAuthGuard } from '../../../lib/auth/guards/jwt-cookies-websocket-auth.guard'
import { AllExceptionsWebsocketFilter } from '../../../lib/nest-utils'
import { AuthService } from '../../users/auth/auth.service'
import { WebsocketJwtUser } from '../../users/auth/decorators/websocket-jwt-user.decorator'
import { TriggerEventsService } from './trigger-events.service'

@WebSocketGateway({
	cors: {
		origin: [process.env['FRONTEND_HOST']],
		credentials: true,
	},
	withCredentials: true,
	cookie: true,
	connectTimeout: 10_000,
	namespace: WEBSOCKET_NAMESPACE.TRIGGER_EVENTS,
})
export class TriggerEventsWebSocketService implements OnGatewayConnection, OnGatewayDisconnect {
	private readonly logger = new Logger(TriggerEventsWebSocketService.name)

	constructor(private authService: AuthService, private readonly triggerEventsService: TriggerEventsService) {}

	// TODO move to parent class to share auth logic
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
	@SubscribeMessage(WEBSOCKET_EVENT.WATCH_WEBHOOK_TRIGGER_EVENTS)
	async handleWatchWebhookTriggerEvents(
		@ConnectedSocket() client: Socket,
		@MessageBody() data: WatchTriggerEventsWSInput,
		@WebsocketJwtUser() user: RequestUser,
	) {
		const watcher = await this.triggerEventsService.watchTriggerEvents(
			{
				flowId: data.flowId,
				triggerName: data.triggerName,
			},
			user.projectId,
			user.id,
			true,
		)
		client.emit(WEBSOCKET_EVENT.WEBHOOK_TRIGGER_EVENTS_STARTED)
		console.log('WATCHER 1');
		const response = await watcher()
		console.log('WATCHER 2');
		client.emit(WEBSOCKET_EVENT.WATCH_WEBHOOK_TRIGGER_EVENTS_RESPONSE, response)
	}

	@UseGuards(JwtCookiesWebsocketAuthGuard)
	@UseFilters(new AllExceptionsWebsocketFilter())
	@SubscribeMessage(WEBSOCKET_EVENT.CANCEL_WEBHOOK_WATCHER)
	async handleTriggerEventWatcherCancelation(@ConnectedSocket() client: Socket, @MessageBody() data: WatchTriggerEventsWSInput) {
		await this.triggerEventsService.cancelTriggerEventsWatcher({
			flowId: data.flowId,
			triggerName: data.triggerName,
		})
		client.emit(WEBSOCKET_EVENT.WEBHOOK_WATCHER_CANCELED)
	}
}
