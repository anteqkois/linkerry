import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'
import { Socket } from 'socket.io'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

@Injectable()
export class JwtCookiesWebsocketAuthGuard extends AuthGuard('jwt-websocket') {
	constructor(private reflector: Reflector) {
		super()
	}

	override canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()])
		if (isPublic) {
			return true
		}
		return super.canActivate(context)
	}

	override getRequest<T = any>(context: ExecutionContext): T {
		return context.switchToWs().getClient<Socket>().handshake as any
	}

	override handleRequest(err: any, user: any, info: any) {
		if (err || !user) {
			throw err || new UnauthorizedException('Invalid authorization token')
		}
		return user
	}
}
