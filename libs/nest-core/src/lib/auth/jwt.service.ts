import { JwtTokenPayload } from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import dayjs from 'dayjs'

@Injectable()
export class JWTService {
	private readonly logger = new Logger(JWTService.name)

	constructor(private configService: ConfigService, private jwtService: JwtService) {}

	generateToken({ payload }: { payload: Omit<JwtTokenPayload, 'iss' | 'exp'> }) {
		const secret = this.configService.get('JWT_SECRET')
		const expireUnix = dayjs().unix() + Number(this.configService.get<number>('JWT_ACCES_TOKEN_EXPIRE_UNIX', 3600))

		return this.jwtService.sign({ ...payload, iss: 'linkerry', exp: expireUnix }, { secret })
	}
}
