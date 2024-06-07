import { CustomError, ErrorCode, JwtRefreshTokenPayload, JwtTokenPayload, isEmpty } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import dayjs from 'dayjs'

@Injectable()
export class JWTCustomService {
  private JWT_SECRET: string
  public JWT_ACCESS_TOKEN_EXPIRE_SSECONDS: number
  public JWT_REFRESH_TOKEN_EXPIRE_SSECONDS: number

  constructor(private readonly configService: ConfigService, private readonly jwtService: JwtService) {
    this.JWT_SECRET = this.configService.getOrThrow('JWT_SECRET')
    if (isEmpty(this.JWT_SECRET)) throw new CustomError(`JWT_SECRET is empty`, ErrorCode.SYSTEM_ENV_INVALID)

    this.JWT_ACCESS_TOKEN_EXPIRE_SSECONDS = Number(this.configService.getOrThrow('JWT_ACCESS_TOKEN_EXPIRE_SSECONDS'))
    if (isEmpty(this.JWT_ACCESS_TOKEN_EXPIRE_SSECONDS))
      throw new CustomError(`JWT_ACCESS_TOKEN_EXPIRE_SSECONDS is empty`, ErrorCode.SYSTEM_ENV_INVALID)

    this.JWT_REFRESH_TOKEN_EXPIRE_SSECONDS = Number(this.configService.getOrThrow('JWT_REFRESH_TOKEN_EXPIRE_SSECONDS'))
    if (isEmpty(this.JWT_REFRESH_TOKEN_EXPIRE_SSECONDS))
      throw new CustomError(`JWT_REFRESH_TOKEN_EXPIRE_SSECONDS is empty`, ErrorCode.SYSTEM_ENV_INVALID)
  }

  generateToken({ payload }: { payload: Omit<JwtTokenPayload, 'iss' | 'exp'> }) {
    const secret = this.JWT_SECRET
    const expireUnix = dayjs().unix() + this.JWT_ACCESS_TOKEN_EXPIRE_SSECONDS

    return this.jwtService.sign({ ...payload, iss: 'linkerry', exp: expireUnix }, { secret })
  }

  generateRefreshToken({ payload }: { payload: Omit<JwtRefreshTokenPayload, 'iss' | 'exp'> }) {
    const secret = this.JWT_SECRET
    const expireUnix = dayjs().unix() + this.JWT_REFRESH_TOKEN_EXPIRE_SSECONDS

    return this.jwtService.sign({ ...payload, iss: 'linkerry', exp: expireUnix }, { secret })
  }
}
