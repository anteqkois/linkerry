import { Cookies, JWTPrincipalType, JwtTokenPayload, RequestUser, RequestWorker, parseCookieString } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Socket } from 'socket.io'

// TODO move to modules/users
@Injectable()
export class JwtWebsocketStrategy extends PassportStrategy(Strategy, 'jwt-websocket') {
	constructor(private configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([JwtWebsocketStrategy.extractJWTFromCookie]),
			ignoreExpiration: false,
			secretOrKey: configService.get('JWT_SECRET'),
			usernameField: 'sub',
			// TODO implement issuer and audience security
			// issuer: If defined the token issuer (iss) will be verified against this value.
			// audience: If defined, the token audience (aud) will be verified against this value.
		})
	}

	private static extractJWTFromCookie(req: any): string | null {
		const cookies = (req as Socket['handshake']).headers.cookie
		if (!cookies) return null
		const parsedCookieAuth = parseCookieString(cookies)[Cookies.ACCESS_TOKEN]
		if (!parsedCookieAuth) return null
		return parsedCookieAuth
	}

	async validate(payload: JwtTokenPayload) {
		// todo check for privilages using calb ? Logic to get privilages from db
		switch (payload.type) {
			case JWTPrincipalType.CUSTOMER:
				return { id: payload.sub, exp: payload.exp, type: JWTPrincipalType.CUSTOMER, projectId: payload.projectId } as RequestUser
			case JWTPrincipalType.WORKER:
				return { id: payload.sub, exp: payload.exp, type: JWTPrincipalType.WORKER, projectId: payload.projectId } as RequestWorker
		}
	}
}
