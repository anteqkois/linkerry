import { JwtTokenPayload } from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JWTService {
	private readonly logger = new Logger(JWTService.name)

	constructor(
		private configService: ConfigService,
		private jwtService: JwtService,
	) {}

	generateToken({ payload }: { payload: JwtTokenPayload }) {
		const secret = this.configService.get('JWT_SECRET')
		return this.jwtService.sign(payload, { secret })
	}
}
