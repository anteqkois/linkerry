import { CustomError, ErrorCode, LINKERRY_API_KEY_HEADER, isEmpty } from '@linkerry/shared'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'
import { Observable } from 'rxjs'

@Injectable()
export class AdminGuard implements CanActivate {
  private LINKERRY_API_KEY: string

  constructor(private readonly reflector: Reflector, private readonly configService: ConfigService) {
    this.LINKERRY_API_KEY = this.configService.getOrThrow('LINKERRY_API_KEY')
    if (isEmpty(this.LINKERRY_API_KEY)) throw new CustomError(`LINKERRY_API_KEY is empty`, ErrorCode.SYSTEM_ENV_INVALID)
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as FastifyRequest
    const apiKey = request.headers[LINKERRY_API_KEY_HEADER]

    if (!apiKey) return false
    if (apiKey !== this.LINKERRY_API_KEY) return false
    return true
  }
}
