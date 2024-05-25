import { CustomError, ErrorCode, JwtTokenPayload, isEmpty } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import dayjs from 'dayjs'

@Injectable()
export class JWTCustomService {
  private  JWT_SECRET: string
  private  JWT_ACCES_TOKEN_EXPIRE_SSECONDS: string

  constructor(private readonly configService: ConfigService, private readonly jwtService: JwtService) {
    this.JWT_SECRET = this.configService.getOrThrow('JWT_SECRET')
    if (isEmpty(this.JWT_SECRET)) throw new CustomError(`JWT_SECRET is empty`, ErrorCode.SYSTEM_ENV_INVALID)
    this.JWT_ACCES_TOKEN_EXPIRE_SSECONDS = this.configService.getOrThrow('JWT_ACCES_TOKEN_EXPIRE_SSECONDS')
    if (isEmpty(this.JWT_ACCES_TOKEN_EXPIRE_SSECONDS)) throw new CustomError(`JWT_ACCES_TOKEN_EXPIRE_SSECONDS is empty`, ErrorCode.SYSTEM_ENV_INVALID)
  }

  generateToken({ payload }: { payload: Omit<JwtTokenPayload, 'iss' | 'exp'> }) {
    const secret = this.JWT_SECRET
    const expireUnix = dayjs().unix() + Number(this.JWT_ACCES_TOKEN_EXPIRE_SSECONDS)

    return this.jwtService.sign({ ...payload, iss: 'linkerry', exp: expireUnix }, { secret })
  }
}
