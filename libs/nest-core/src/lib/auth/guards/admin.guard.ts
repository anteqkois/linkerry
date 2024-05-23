import { LINKERRY_API_KEY_HEADER } from '@linkerry/shared'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'
import { Observable } from 'rxjs'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest() as FastifyRequest
    const apiKey = request.headers[LINKERRY_API_KEY_HEADER]

    if (!apiKey) return false
    if (apiKey !== this.configService.getOrThrow('LINKERRY_API_KEY')) return false
    return true
  }
}
