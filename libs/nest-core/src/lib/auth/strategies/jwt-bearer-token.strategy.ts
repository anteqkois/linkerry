import { JWTPrincipalType, JwtTokenPayload, RequestUser, RequestWorker } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

// TODO move to modules/users
@Injectable()
export class JwtBearerTokenStrategy extends PassportStrategy(Strategy, 'jwt-bearer-token') {
	constructor(private configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([JwtBearerTokenStrategy.extractTokenFromHeader]),
			ignoreExpiration: false,
			secretOrKey: configService.get('JWT_SECRET'),
			usernameField: 'sub',
			// TODO implement issuer and audience security
			// issuer: If defined the token issuer (iss) will be verified against this value.
			// audience: If defined, the token audience (aud) will be verified against this value.
		})
	}

	private static extractTokenFromHeader(req: any): string | null {
		const [type, token] = req.headers?.authorization?.split(' ') ?? []
		return type === 'Bearer' ? token : null
	}

	async validate(payload: JwtTokenPayload) {
		// todo check for privilages using calb ? Logic to get privilages from db
		console.log('JWT payload', payload)
		switch (payload.type) {
			case JWTPrincipalType.CUSTOMER:
				return { id: payload.sub,  exp: payload.exp, type: JWTPrincipalType.CUSTOMER, projectId: payload.projectId } as RequestUser
			case JWTPrincipalType.WORKER:
				return { id: payload.sub, exp: payload.exp, type: JWTPrincipalType.WORKER, projectId: payload.projectId } as RequestWorker
		}
	}
}
