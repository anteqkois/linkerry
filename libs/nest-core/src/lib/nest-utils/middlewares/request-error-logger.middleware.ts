import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'

@Injectable()
export class RequestErrorLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger()

  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    res.on('finish', () => {
      const statusCode = res.statusCode
      if (statusCode === 400 || statusCode === 401 || statusCode === 404 || statusCode === 405) {
        this.logger.warn(`[${req.method}] ${req.url} - ${statusCode}`)
      }
    })
    next()
  }
}
