// import * as fs from 'fs';
import { CustomHttpExceptionResponse } from '@linkerry/shared'
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { CustomBaseExceptionsFilter } from './base-exception.filter'

@Catch()
export class AllExceptionsFilter extends CustomBaseExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest<FastifyRequest>()

    const { errorCode, errorMessage, fieldPath, humanMessage, metadata, status } = this.produceFields(exception)

    const errorResponse = this.getErrorResponse({
      status,
      errorMessage,
      errorCode,
      message: humanMessage,
      request,
      fieldPath: fieldPath,
    })
    const errorLog = this.getErrorLog(errorResponse, humanMessage, request, exception)
    this.logger.error(errorLog, metadata)
    // this.writeErrorLogToFile(errorLog);
    response.status(status).send(errorResponse)
  }

  private getErrorResponse = ({
    errorCode,
    errorMessage,
    message,
    request,
    status,
    fieldPath,
  }: {
    status: HttpStatus
    errorMessage: string
    errorCode: string
    message: string
    request: FastifyRequest
    fieldPath?: string
  }): CustomHttpExceptionResponse => ({
    statusCode: status,
    code: errorCode,
    message,
    error: errorMessage,
    path: request.url,
    method: request.method,
    timestamp: new Date(),
    fieldPath,
    // request_id
    // "details": {
    //   "field": "product_id",
    //   "value": "12345",
    //   "reason": "Product with ID 12345 not found."
    // },
  })

  private getErrorLog = (
    errorResponse: CustomHttpExceptionResponse,
    humanMessage: string,
    request: FastifyRequest & { user?: any },
    exception: any,
  ): string => {
    const { statusCode } = errorResponse
    const { method, url } = request
    const errorLog = `[${method}] ${url} - ${statusCode}
    ${humanMessage}
    User: ${JSON.stringify(request.user?.id ?? 'unknown')}
		${exception?.stack}`
    return errorLog
  }

  // private writeErrorLogToFile = (errorLog: string): void => {
  //   fs.appendFile('error.log', errorLog, 'utf8', (err) => {
  //     if (err) throw err;
  //   });
  // };
}
