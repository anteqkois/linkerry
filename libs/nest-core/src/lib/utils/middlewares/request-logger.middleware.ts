import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('Request')
  use(req: FastifyRequest, res: FastifyReply, next: () => void) {
    const { ip, method, originalUrl: url } = req
    this.logger.verbose(`${method} - ${url} - ${ip}`)
    next()
  }
}
