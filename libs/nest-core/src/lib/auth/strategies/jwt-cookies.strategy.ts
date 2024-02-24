import { Cookies, JWTPrincipalType, JwtTokenPayload, RequestUser, RequestWorker } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtCookiesStrategy extends PassportStrategy(Strategy, 'jwt-cookies') {
	constructor(private configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([JwtCookiesStrategy.extractJWTFromCookie]),
			ignoreExpiration: false,
			secretOrKey: configService.get('JWT_SECRET'),
			usernameField: 'name',
			// TODO implement issuer and audience security
			// issuer: If defined the token issuer (iss) will be verified against this value.
			// audience: If defined, the token audience (aud) will be verified against this value.
		})
	}

	private static extractJWTFromCookie(req: { cookies: { [Cookies.ACCESS_TOKEN]?: string } }): string | null {
		if (req.cookies && req.cookies[Cookies.ACCESS_TOKEN]) {
			return req.cookies[Cookies.ACCESS_TOKEN]
		}
		return null
	}

	async validate(payload: JwtTokenPayload) {
		// todo check for privilages using calb ? Logic to get privilages from db
		console.log('JWT payload', payload)
		switch (payload.type) {
			case JWTPrincipalType.CUSTOMER:
				return { id: payload.sub, name: payload.name, exp: payload.exp, type: JWTPrincipalType.CUSTOMER } as RequestUser
			case JWTPrincipalType.WORKER:
				return { id: payload.sub, exp: payload.exp, type: JWTPrincipalType.WORKER } as RequestWorker
		}
	}
}
